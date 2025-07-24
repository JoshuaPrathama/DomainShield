import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FetchDataHelper from "../../helper/FetchDataHelper";
import { CheckingResultSchema } from "../../schema/checkingResult.schema";
import { z } from "zod";
import ParticlesComponent from "../../components/particles";
import ReCAPTCHA from "react-google-recaptcha";
import ServiceCard from "../../components/CardUrl";
import DeveloperCard from "../../components/DeveloperCard";
import LoadingPopup from "../../components/ Loading";


declare global {
  interface Window {
    scrollToScanning?: () => void;
    scrollToHowItWorks?: () => void;
    scrollToDevelopers?: () => void;
  }
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [domain, setDomain] = useState<string>("");
  const [inputError, setInputError] = useState<boolean>(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(true);
  const { fetchData: fetchChecking, ...ResultData } =
    FetchDataHelper<z.infer<typeof CheckingResultSchema>>();
  const ScanningSection = useRef<HTMLDivElement>(null);
  const ServiceSection = useRef<HTMLDivElement>(null);
  const DeveloperSection = useRef<HTMLDivElement>(null);
  const developers = [
    {
      name: "Joshua Prathama Raga Lawa",
      role: "Cyber Security Student",
      image: "/assets/homeBackground.png",
      linkedin: "https://linkedin.com/in/johndoe",
    },
    {
      name: "Namira Amanda Amar",
      role: "Cyber Security Student",
      image: "/assets/homeBackground.png",
      linkedin: "https://linkedin.com/in/janesmith",
    },
    {
      name: "I Made Prama Sedana",
      role: "Cyber Security Student",
      image: "/assets/homeBackground.png",
      linkedin: "https://linkedin.com/in/alicejohnson",
    },
  ];

  const scrollScanningSection = () => {
    if (ScanningSection.current) {
      const navbarHeight = 80; // Sesuaikan dengan tinggi navbar (dalam px)
      const elementPosition =
        ScanningSection.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  const isValidDomain = (domain: string): boolean => {
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain.trim());
  };


  const scrollServiceSection = () => {
    if (ServiceSection.current) {
      const navbarHeight = 80; // Sesuaikan dengan tinggi navbar (dalam px)
      const elementPosition =
        ServiceSection.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  const scrollToDevelopers = () => {
    if (DeveloperSection.current) {
      const navbarHeight = 80; // Sesuaikan dengan tinggi navbar (dalam px)
      const elementPosition =
        DeveloperSection.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const scrollTarget = localStorage.getItem("scrollTo");

    if (scrollTarget === "Scanning") {
      scrollScanningSection();
    } else if (scrollTarget === "HowItWorks") {
      scrollServiceSection();
    } else if (scrollTarget === "Developers") {
      scrollToDevelopers();
    }

    localStorage.removeItem("scrollTo");
  }, []);


  useEffect(() => {
    window.scrollToScanning = scrollScanningSection;
    window.scrollToHowItWorks = scrollServiceSection;
    window.scrollToDevelopers = scrollToDevelopers;
  }, []);


  const handleCheck = () => {

    const trimmedDomain = domain.trim();

    if (!isValidDomain(trimmedDomain)) {
      setInputError(true);
      return;
    }

    if (!isCaptchaVerified) {
      alert("Please verify the CAPTCHA before checking.");
      return;
    }

    // setInputError(false);
    fetchChecking({
      url: "/check_domain",
      method: "POST",
      schema: CheckingResultSchema,
      axiosConfig: {
        data: {
          domain: domain.trim(),
          scan_type: "light",
        },
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value);
    // if (e.target.value.trim() !== "") {
    //     setInputError(false);
    // }
  };

  const handleCaptchaVerify = (value: string | null) => {
    if (value) {
      setIsCaptchaVerified(true);
    } else {
      setIsCaptchaVerified(true);
    }
  };

  useEffect(() => {
    console.log(ResultData);
    if (ResultData.success) {
      navigate("/scan-result", { state: { data: ResultData.data } });
    }
  }, [ResultData]);

  return (
    <div>
      <div ref={ScanningSection} className="relative h-[650px]">
        <ParticlesComponent />
        <div className="absolute inset-0 pt-20 h-full bg-transparent px-4 md:px-20">
          <div className="px-4 py-8 mx-auto max-w-full sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-16">
            <div className="max-w-3xl mb-6 mx-auto text-center lg:max-w-3xl">
              <h1 className="w-full mb-6 font-sans text-2xl lg:text-4xl font-bold leading-none tracking-tight text-blue-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
                DOMAIN SHIELD
              </h1>
              <p className="text-gray-700 text-sm md:text-md lg:text-base">
                A specialized web application for analyzing domain reputation, focusing on the detection of online gambling content propagation. It scans domains to identify defaced pages, suspicious backlinks, and evaluates domain security configurations such as DMARC, SPF, and DKIM to assess email spoofing vulnerability.
              </p>
            </div>

            <div className="bg-white mx-auto overflow-hidden rounded-xl shadow-lg max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg text-xs lg:text-base w-full">
              <div className="p-4 lg:p-8 text-center">
                <h1 className="text-sm lg:text-xl text-gray-700 mb-4">
                  Check Your Domain Here
                </h1>
                <div className="flex flex-col sm:flex-row items-center justify-center">
                  <div className="w-full sm:w-auto flex-grow bg-white border focus-within:border-blue-400 focus-within:ring focus-within:ring-blue-300 focus-within:ring-opacity-40">
                    <div className="flex flex-col sm:flex-row">
                      <input
                        type="text"
                        placeholder="Enter domain (e.g., domain.go.id)"
                        name="domain"
                        value={domain}
                        disabled={ResultData.loading}
                        onChange={handleInputChange}
                        className="flex-1 text-xs lg:text-sm h-10 px-4 py-2 m-1 text-gray-700 placeholder-gray-400 bg-transparent border-none appearance-none focus:outline-none focus:placeholder-transparent focus:ring-0"
                      />

                      <button
                        type="submit"
                        className={`inline-flex items-center h-12 px-4 border border-blue-800 bg-blue-800 text-white ${!isCaptchaVerified
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-900"
                          }`}
                        onClick={handleCheck}
                        disabled={!isCaptchaVerified}
                      >
                        <span className="flex justify-center items-center w-full">
                          Check
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {inputError && (
                  <p className="text-red-600 text-xs pt-1 pl-2">
                    Masukkan domain yang valid. Contoh: <code>unsia.ac.id</code>
                  </p>
                )}


                {/* reCAPTCHA */}
                <div className="flex justify-center pt-4">
                  <ReCAPTCHA
                    sitekey="6Ld-g9EqAAAAAAbTWJAFbOUK9MtPErbPnVjia-Zh"
                    onChange={handleCaptchaVerify}
                  />
                </div>

                <h1 className="pt-3 text-md lg:text-md text-gray-700">
                  Check your domain reputation by scanning for online gambling promotions and verifying your SPF, DKIM, and DMARC configurations.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={ServiceSection} className="bg-[#F5F7F8FF] px-4 md:px-20 py-12">
        <div className="max-w-screen-xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-gray-600 text-lg mb-10">
            Our comprehensive tools help you monitor domain reputation, detect illicit promotions like online gambling, and verify SPF, DKIM, and DMARC settings to enhance your domain security.
          </p>

          {/* Grid layout for service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <ServiceCard
              title="Domain Scan"
              description="Perform a quick scan to check if your domain has been affected by unauthorized content."
              linkText=""
              linkHref=""
              Icon={() => (
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 110 16 8 8 0 010-16zm0-2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              )}
            />

            {/* Card 2 */}
            <ServiceCard
              title="Generate Report"
              description="Genering Report for your domain scan result."
              linkText=""
              linkHref=""
              Icon={() => (
                <img
                  src="/assets/report.svg"
                  alt="Real-time Monitoring Icon"
                  className="w-8 h-8"
                />
              )}
            />

            {/* Card 3 */}
            <ServiceCard
              title="Security Insights"
              description="Get detailed security insights and recommendations for your domain."
              linkText="View Report"
              linkHref="/security-insight"
              Icon={() => (
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 3a1 1 0 011-1h2a1 1 0 011 1v3h-4V3zM3 8a1 1 0 011-1h12a1 1 0 011 1v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
              )}
            />
          </div>
        </div>
      </div>
      <div
        ref={DeveloperSection}
        className="bg-[#F5F7F8FF] px-4 md:px-20 py-12"
      >
        <div className="max-w-screen-xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Developers
          </h1>
          <p className="text-gray-600 text-lg mb-10">
            Our team of skilled developers ensures security and efficiency in
            every scan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {developers.map((dev, index) => (
              <DeveloperCard
                key={index}
                name={dev.name}
                role={dev.role}
                image={dev.image}
                linkedin={dev.linkedin}
              />
            ))}
          </div>
        </div>
      </div>
      <LoadingPopup isOpen={ResultData.loading} />
    </div>
  );
};

export default HomePage;
