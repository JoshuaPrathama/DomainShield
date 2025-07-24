from itertools import product
import re
from urllib.parse import quote_plus
from bs4 import BeautifulSoup
import certifi
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from nltk.data import find
import tldextract
import requests
from selenium.webdriver.common.by import By
from fake_useragent import UserAgent
from seleniumbase import Driver
from seleniumbase import SB
# from selenium.webdriver.chrome.options import Options as ChromeOptions
import undetected_chromedriver as uc
from functools import lru_cache
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any
import atexit
import dns.resolver
from cachetools import TTLCache
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


app = Flask(__name__)
CORS(app, origins="*")

user_agent = UserAgent().random
driver = None

# Create a session with connection pooling
session = requests.Session()
retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
)
adapter = HTTPAdapter(max_retries=retry_strategy, pool_connections=10, pool_maxsize=10)
session.mount("http://", adapter)
session.mount("https://", adapter)
# chrome_options = ChromeOptions()
# chrome_options.add_argument('--no-sandbox')
# chrome_options.add_argument('--disable-dev-shm-usage')
def init_driver():
    global driver
    if driver is None:
        driver = Driver(uc=True, headless=True)
    return driver

def cleanup_driver():
    global driver
    if driver:
        try:
            driver.quit()
        except Exception as e:
            print(f"Error cleaning up driver: {e}")
        finally:
            driver = None

# Register cleanup function
atexit.register(cleanup_driver)

def load_words_from_file(filename):
    try:
        with open(filename, "r", encoding="utf-8") as file:
            return set(word.strip().lower() for word in file.readlines())
    except FileNotFoundError:
        print(f"Warning: {filename} not found!")
        return set()

kamus = load_words_from_file("kamus.txt")
judi_words = load_words_from_file("judi_word.txt")

keywords = ['mahjong']
#keywords = ['mahjong', 'slot', 'toto', 'togel', 'judi', 'gacor', 'maxwin', 'zeus', 'bet', 'jackpot', 'big win', 'bonus', 'scatter', 'miliarbet', 'olympus']
keywords_judi = [
    'judi online', 'slot', 'gacor', 'maxwin', 'bet', 'toto', 'togel',
    'zeus', 'mahjong', 'ways', 'gacor banget', 'big win', 'jackpot',
    'bonus', 'gambling', 'casino', 'live slot', 'slot game', 'slots online', 'scatter', 'download apk', 'miliarbet', 'olympus'
]
indonesian_tlds = {".id", ".go.id", ".ac.id", ".co.id", ".or.id", ".sch.id", ".mil.id", ".my.id", ".biz.id", ".web.id"}
link_keywords = ['login', 'register', 'jackpot', 'claim now']
trusted_domains = {"youtube.com", "google.com", "pinterest.com", "lazada.com", "facebook.com", "twitter.com", "linkedin.com", "instagram.com"}
reverse_mappings = {}
Patterns = {
    'a': ["a", "4", "@", "/-\\", "/\\", "/_\\", "^", "λ", "∂", "//-\\\\", "/=\\", "ä", "Ʌ", "Д"],
    'b': ["b", "8", "|3", "ß", "13", "l3", "]3", "|o", "lo", "I3", "₿", "ʙ", "฿"],
    'c': ["c", "(", "<", "[", "{", "©", "¢", "€", "ↄ", "ʗ", "Ↄ"],
    'd': ["d", "|]", "1]", "|)", "])", "i>", "|>", "o|", "Ð", "∂", "ð", "cl", "ʆ", "ȡ"],
    'e': ["e", "3", "&", "[-", "€", "£", "ə", "℮", "ɇ", "є"],
    'f': ["f", "|=", "]=[", "}=", "ph", "(=", "ʃ", "ƒ", "v=", "Ⅎ"],
    'g': ["g", "6", "9", "&", "(_+)", "gee", "(γ,)", "cj", "Ꮹ", "ǥ", "ɠ"],
    'h': ["h", "#", "[-]", "{-}", "}-{", "╫", "]-[", "н", "н̄", "ҥ"],
    'i': ["i", "!", "|", "eye", "ai", "¡", "ΐ", "ɩ", "ỉ", "1"],
    'j': ["j", "_|", "_/", "</", "_)", "¿", "ʝ", "ɉ", "ɟ", "ʲ"],
    'k': ["k", "x", "|<", "|x", "|{", "/<", "\\<", "ɮ", "Ҝ", "Ҡ"],
    'l': ["l", "1", "7", "|_", "1_", "£", "¬", "el", "ł", "ʟ"],
    'm': ["m", "/\\/\\", "|\\/|", "em", "|v|", "^^", "nn", "/|\\", "/|/|", "爪", "₥", "м"],
    'n': ["n", "|\\|", "/\\/", "[\\]", "{\\}", "₪", "/|/", "ɳ", "и", "п"],
    'o': ["o", "0", "()", "[]", "{}", "¤", "Ω", "ø", "◯", "ⵔ"],
    'p': ["p", "|*", "l*", "1*", "|o", "|>", "9", "[]d", "℗", "þ", "ρ"],
    'q': ["q", "0_", "o_", "0,", "o,", "(,)", "[,]", "¶", "9", "Ԛ"],
    'r': ["r", "|2", "l2", "/2", "Я", "ʁ", "ℜ", "Ɍ", "₹", "г"],
    's': ["s", "5", "$", "z", "§", "š", "ʃ", "ȿ", "ƨ", "Ϟ"],
    't': ["t", "7", "+", "-|-", "-1-", "']['", "†", "⊥", "Ŧ", "т"],
    'u': ["u", "|_|", "(_)","[_]", "{_}", "µ", "yew", "Ʉ", "∪", "υ"],
    'v': ["v", "\\/", "\\\\//", "√", "ν", "∨", "ⱽ", "ѵ", "✓", "υ"],
    'w': ["w", "\\/\\/", "vv", "'//", "\\^/", "\\_|_/", "Ш", "ɰ", "₩", "ѡ"],
    'x': ["x", "><", "} {", "ecks", "*", ")(", "Ж", "×", "χ", "✕"],
    'y': ["y", "`/", "`(", "'/", "\\-/", "Ψ", "¥", "λ", "Ч", "ϒ"],
    'z': ["z", "2", "%", "7_", "ʒ", "≥", "Ƶ", "乙", "ż", "Ɀ"],
}

for key, values in Patterns.items():
    for val in values:
        reverse_mappings.setdefault(val, []).append(key)


def count_valid_words(sentence, dictionary):
    return sum(1 for word in dictionary if word in sentence)

def weighted_score(sentence, kamus, judi_words):
    count_kamus = count_valid_words(sentence, kamus)
    count_judi = count_valid_words(sentence, judi_words) * 2
    return count_kamus + count_judi

kamus = load_words_from_file("kamus.txt")
judi_words = load_words_from_file("judi_word.txt")

def generate_transformations(text, reverse_mappings):
    words = text.split()
    all_transformations = []

    for word in words:
        possible_replacements = [[] for _ in range(len(word) + 1)]

        for i in range(len(word)):
            for j in range(i + 1, len(word) + 1):
                substring = word[i:j]
                if substring in reverse_mappings:
                    possible_replacements[i].append((j, reverse_mappings[substring]))

        def backtrack(index):
            if index == len(word):
                return [""]
            results = []
            for end_index, replacements in possible_replacements[index]:
                for replacement in replacements:
                    for suffix in backtrack(end_index):
                        results.append(replacement + suffix)
            return results

        transformations = backtrack(0)
        all_transformations.append(transformations if transformations else [word])

    return [" ".join(combination) for combination in product(*all_transformations)]
          # driver.save_screenshot(f"screenshot_{keyword}.png")

# def search_urls_with_dorking(domain):
#     found_urls = []
#     try:
#         driver = init_driver()
#         for keyword in keywords:
#             search_query = f"inurl:{domain} intext:{keyword}"
#             encoded_query = quote_plus(search_query)
#             search_url = f"https://www.google.com/search?q={encoded_query}&client=firefox-b-d"
#             driver.open(search_url)
#             driver.sleep(2)
            
#             results = driver.find_elements(By.CSS_SELECTOR, ".tF2Cxc a")
#             for result in results:
#                 url = result.get_attribute("href")
#                 if url:
#                     print(f"URL ditemukan: {url}")
#                     found_urls.append(url)
#     except Exception as e:
#         print(f"Error in search_urls_with_dorking: {e}")
#     finally:
#         cleanup_driver()
#     return found_urls

def search_urls_with_dorking(domain):
    found_urls = []
    try:
        for keyword in keywords:
            search_query = f"inurl:{domain} intext:{keyword}"
            encoded_query = quote_plus(search_query)
            search_url = f"https://www.google.com/search?q={encoded_query}&client=firefox-b-d"

            with SB(uc=True, headless=True, locale="en") as sb:
                sb.open(search_url)
                sb.sleep(2)  # Tunggu Google load
                # Optional: debug screenshot
                # sb.save_screenshot("debug.png")
                # Optional: simpan hasil HTML buat debug
                # with open("google_search_debug.html", "w", encoding="utf-8") as f:
                #     f.write(sb.get_page_source())

                results = sb.find_elements(By.CSS_SELECTOR, ".tF2Cxc a")
                print(f"Jumlah link ketemu: {len(results)}")
                for result in results:
                    url = result.get_attribute("href")
                    if url:
                        print(f"URL ditemukan: {url}")
                        found_urls.append(url)
    except Exception as e:
        print(f"Error in search_urls_with_dorking: {e}")
    return found_urls



def get_url_content(url):
    driver2 = None
    try:
        print(f"Fetching URL: {url}")
        response = session.get(url, timeout=10, verify=False, allow_redirects=True)
        print(f"URL: {url} - {response.status_code}")

        # Default fallback value
        page_source = response.text
        page_base64 = None
        current_url = url
        driver2 = Driver(uc=True, headless=True)
        driver2.set_window_size(1200, 800)
        
        if response.status_code in [403, 200]:
            try:
                driver2.set_page_load_timeout(10)  # Timeout untuk page load Selenium
                driver2.open(url)
                driver2.sleep(2)

                # Screenshot & page source dari browser
                # driver2.save_screenshot("screenshot.png")
                page_base64 = driver2.get_screenshot_as_base64()
                page_source = driver2.page_source
                current_url = driver2.current_url

            except Exception as selenium_err:
                print(f"[ERROR] Selenium error on {url}: {selenium_err}")
                # Biarkan page_source tetap dari requests sebagai fallback

        # driver2.save_screenshot("screenshot.png")
        page_base64 = driver2.get_screenshot_as_base64()
        return {
            "url": current_url,
            "page_source": page_source,
            "page_image": page_base64,
        }

    except requests.exceptions.Timeout:
        print(f"[ERROR] Request timeout for URL: {url}")
        return {"url": url, "page_source": None, "page_image": None}

    except Exception as ex:
        print(f"[ERROR] General error: {ex}")
        return {"url": url, "page_source": None, "page_image": None}

    finally:
        if driver2:
            try:
                driver2.quit()
            except Exception as e:
                print(f"Error cleaning up driver2: {e}")


# def get_url_content(url):
#     try:
#         print(f"Fetching URL: {url}")
#         response = session.get(url, timeout=10, verify=False, allow_redirects=True)
#         print(f"URL: {url} - {response.status_code}")

#         # Fallback value jika tidak pakai browser
#         page_source = response.text
#         page_base64 = None
#         current_url = url

#         # Hanya gunakan browser jika response HTTP OK atau Forbidden
#         if response.status_code in [403, 200]:
#             try:
#                 with SB(uc=True, headless=True, locale="en") as sb:
#                     sb.open(url)
#                     sb.sleep(2)
#                     page_source = sb.get_page_source()
#                     current_url = sb.get_current_url()
#                     page_base64 = sb.driver.get_screenshot_as_base64()
#             except Exception as selenium_err:
#                 print(f"[ERROR] Selenium error on {url}: {selenium_err}")
#                 # Tetap pakai hasil dari requests jika Selenium gagal

#         return {
#             "url": current_url,
#             "page_source": page_source,
#             "page_image": page_base64,
#         }

#     except requests.exceptions.Timeout:
#         print(f"[ERROR] Request timeout for URL: {url}")
#         return {"url": url, "page_source": None, "page_image": None}

#     except Exception as ex:
#         print(f"[ERROR] General error: {ex}")
#         return {"url": url, "page_source": None, "page_image": None}


# Pre-compile regex patterns
JUDI_PATTERN = re.compile(r"\b(" + "|".join(keywords_judi) + r")\b", re.IGNORECASE)

@lru_cache(maxsize=1000)
def pattern_match(text):
    text = text.lower()
    # Use pre-compiled pattern for better performance
    matches = JUDI_PATTERN.findall(text)
    return len(matches)

@lru_cache(maxsize=1000)
def transformation_text(text):
    text = text.lower()
    words = text.split()

    # Use set for faster lookups
    unknown_words = {word for word in words if word not in kamus and word not in judi_words}

    if not unknown_words:
        return text

    # Transform only unknown words
    transformed_words = {word: generate_transformations(word, reverse_mappings) for word in unknown_words}

    # Build sentence with transformed words
    all_transformations = []
    for word in words:
        if word in transformed_words:
            all_transformations.append(transformed_words[word])
        else:
            all_transformations.append([word])

    possible_transformed_sentences = [" ".join(combination) for combination in product(*all_transformations)]

    # Use max() with key function for better performance than sorting
    return max(possible_transformed_sentences, 
        key=lambda sentence: weighted_score(sentence, kamus, judi_words),
        default=possible_transformed_sentences[0])

def process_single_url(url: str) -> Dict[str, Any] | None:
    try:
        response_data = get_url_content(url)
        if not response_data or not response_data.get('page_source'):
            return None

        soup = BeautifulSoup(response_data['page_source'], 'html.parser')
        
        title = soup.title.string.strip().lower() if soup.title and soup.title.string else ""
        description_tag = soup.find("meta", attrs={"name": "description"})
        description = description_tag.get("content", "").strip().lower() if description_tag else ""

        print(f"\nTitle: {title}")
        print(f"Description: {description}")
        print(f"URL: {url}\n")

        full_text = soup.get_text(" ", strip=True).lower()

        word_count = 0
        if title or description:
            transformed_title = transformation_text(title)
            transformed_description = transformation_text(description)

            word_count += pattern_match(transformed_title or title)
            word_count += pattern_match(transformed_description or description)

        if word_count == 0:
            word_count = pattern_match(full_text)
            
        if word_count > 2:
            domain_info = tldextract.extract(url)
            current_domain = f"{domain_info.domain}.{domain_info.suffix}"

            # Ambil hanya link eksternal yang mengandung keyword mencurigakan
            external_links = {
                a['href'] for a in soup.find_all('a', href=True)
                if any(keyword in a.get_text(strip=True).lower() for keyword in link_keywords)
                and f"{tldextract.extract(a['href']).domain}.{tldextract.extract(a['href']).suffix}" != current_domain
            }

            return {
                "Original_url": url,
                "compromised": "True",
                "external_links": list(external_links),
                "Redirect_url": response_data['url'],
                "screenshot": response_data['page_image'],
            }

        return None

    except Exception as e:
        print(f"Error processing {url}: {e}")
        return None


def clasify_urls(urls: List[str]) -> List[Dict[str, Any]]:
    results = []
    with ThreadPoolExecutor(max_workers=2) as executor:
        future_to_url = {executor.submit(process_single_url, url): url for url in urls}
        
        for future in as_completed(future_to_url):
            result = future.result()
            if result:
                results.append(result)

    return results


def filtered_url_list(urls, domain):
    print("Masuk sini gak?")
    filtered_urls = []
    for url in urls:
        url_domain_name = tldextract.extract(url).domain
        url_suffix = tldextract.extract(url).suffix
        url_domain = f"{url_domain_name}.{url_suffix}"
        if url_domain == domain and url_domain not in trusted_domains:
            filtered_urls.append(url)
    return filtered_urls


# Definisi fungsi untuk pengecekan DNS (SPF, DKIM, DMARC)
import dns.resolver
from cachetools import TTLCache

from cachetools import TTLCache
import dns.resolver

class DomainScanner:
    def __init__(self, cache_duration=60):
        self.cache = TTLCache(maxsize=100, ttl=cache_duration)
        self.nameservers = ["8.8.8.8", "1.1.1.1"]

    def get_dns_records(self, domain, record_type):
        try:
            resolver = dns.resolver.Resolver()
            resolver.nameservers = self.nameservers
            answers = resolver.resolve(domain, record_type)
            return [r.to_text() for r in answers]
        except Exception:
            return []

    def get_spf_level(self, domain):
        records = self.get_dns_records(domain, "TXT")
        for record in records:
            if "v=spf1" in record.lower():
                record_lower = record.lower()
                if "+all" in record_lower:
                    return "Low"
                elif "~all" in record_lower:
                    return "Medium"
                else:
                    return "High"
        return "Low"

    def get_dkim_level(self, domain):
        records = self.get_dns_records(f"default._domainkey.{domain}", "TXT")
        for record in records:
            if "v=dkim1" in record.lower():
                return "High"
        return "Low"

    def get_dmarc_level(self, domain):
        records = self.get_dns_records(f"_dmarc.{domain}", "TXT")
        for record in records:
            if "v=dmarc1" in record.lower():
                record_lower = record.lower()

                # Policy check
                has_p_reject = "p=reject" in record_lower
                has_p_quarantine = "p=quarantine" in record_lower
                has_p_none = "p=none" in record_lower

                # Additional checks
                has_rua = "rua=" in record_lower
                has_ruf = "ruf=" in record_lower
                has_sp = "sp=" in record_lower

                # Logic for level decision
                if has_p_reject:
                    if has_rua and has_ruf and has_sp:
                        return "High"
                    else:
                        return "Medium"
                elif has_p_quarantine:
                    return "Medium"
                elif has_p_none:
                    return "Low"
        return "Low"

    def scan_domain(self, domain):
        if domain in self.cache:
            return self.cache[domain]

        result = {
            "domain": domain,
            "spf_level": self.get_spf_level(domain),
            "dkim_level": self.get_dkim_level(domain),
            "dmarc_level": self.get_dmarc_level(domain),
        }

        self.cache[domain] = result
        return result


    

@app.route('/check_domain', methods=['POST'])
def scan_domain() -> Dict[str, Any]:
    try:
        data = request.get_json()
        if not data or 'domain' not in data:
            abort(400, description="Missing domain parameter")

        domain = data['domain'].strip()
        if not domain:
            abort(400, description="Domain cannot be empty")

        # Search for URLs
        urls = search_urls_with_dorking(domain)
        
        # if urls:
        #     try:
        #         file_name = f"{domain} - list of url.txt"
        #         with open(file_name, "w", encoding="utf-8") as f:
        #             for url in urls:
        #                 f.write(url + "\n")
        #     except Exception as file_err:
        #         print(f"Gagal menulis ke file: {file_err}")

        
        scanner = DomainScanner(cache_duration=300)
        domain_scan_result = scanner.scan_domain(domain)
        
        if not urls:
            return jsonify({
                "total_urls": 0,
                "compromised_urls": 0,
                "compromised_percentage": 0,
                "data": [],
                "domain_scan": domain_scan_result
            })

        # Filter and process URLs
        urls = set(urls)
        filtered_urls = filtered_url_list(urls, domain)
        print(f"Filtered URLs: {filtered_urls}")
        if not filtered_urls:
            return jsonify({
                "total_urls": 0,
                "compromised_urls": 0,
                "compromised_percentage": 0,
                "data": [],
                "domain_scan": domain_scan_result
            })

        # Process URLs concurrently
        result = clasify_urls(filtered_urls)

        # Calculate statistics
        total_urls = len(filtered_urls)
        compromised_urls = sum(1 for item in result if item['compromised'] == 'True')
        compromised_percentage = round((compromised_urls / total_urls * 100), 2) if total_urls > 0 else 0

        # if compromised_urls:
        #     try:
        #         compromised_file = f"{domain} - compromised-url.txt"
        #         with open(compromised_file, "w", encoding="utf-8") as f:
        #             for compromised_url in compromised_urls:
        #                 f.write(compromised_url + "\n")
        #     except Exception as file_err:
        #         print(f"Gagal menulis ke file: {file_err}")
        
        
        return jsonify({
            "total_urls": total_urls,
            "compromised_urls": compromised_urls,
            "compromised_percentage": compromised_percentage,
            "data": result,
            "domain_scan": domain_scan_result
        })

    except Exception as e:
        print(f"Error processing request: {e}")
        abort(500, description="Internal server error")
    finally:
        cleanup_driver()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
