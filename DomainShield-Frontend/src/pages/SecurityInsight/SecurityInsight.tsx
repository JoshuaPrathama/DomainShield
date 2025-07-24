import { ShieldCheck, KeyRound, MailCheck } from 'lucide-react';


const insights = [
    { title: 'Website Defacement', description: 'Gambling operators may inject banners or pop-ups promoting illegal sites, altering your domain’s public pages and harming brand trust.' },
    { title: 'Malicious Redirects', description: 'Hidden JavaScript or compromised server scripts redirect visitors to phishing or illegal gambling platforms.' },
    { title: 'SEO Poisoning & Spam', description: 'Attackers exploit misconfigured CMS or open directories to upload keyword-stuffed pages, driving search traffic toward gambling sites.' },
    { title: 'Drive-by Malware Distribution', description: 'Compromised domain hosts gambling malware installers or links that silently infect visitors with adware or ransomware.' },
    { title: 'Resource Hijacking & DDoS', description: 'Malicious scripts mine cryptocurrency or turn servers into DDoS bots to support large-scale attacks favored by underground gambling rings.' },
    { title: 'Subdomain Takeover', description: 'Attackers claim unused or misconfigured subdomains to host gambling content, impacting your reputation and SEO ranking.' },
];


const protections = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
        title: 'SPF Enforcement',
        description: 'Define authorized mail servers via DNS TXT records to block phishing attempts and unauthorized spoofing.',
    },
    {
        icon: <KeyRound className="w-8 h-8 text-blue-500" />,
        title: 'DKIM Signing',
        description: 'Use cryptographic signatures to validate email integrity and verify the sender’s identity.',
    },
    {
        icon: <MailCheck className="w-8 h-8 text-purple-500" />,
        title: 'DMARC Policy',
        description: 'Set policies (none/quarantine/reject) and receive reports to monitor and enforce email authentication.',
    },
];

export default function DomainSecurityInsightPage() {
    return (
        <>
            <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center px-6">
                <h1 className="mt-8 text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                    Domain Security Insights
                </h1>
                <p className="text-xl text-gray-700 text-center max-w-3xl mb-12 mt-2">
                    Learn how online gambling threats exploit your domain and discover tailored defenses for DNS and email security.
                </p>

                {/* Attack Vector Insights */}
                <section className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {insights.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                            <h2 className="text-2xl font-bold mb-3 text-indigo-600">{item.title}</h2>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </section>

                {/* DNS & Email Protections */}
                <section className="mt-20 w-full max-w-6xl">
                    <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">Key DNS & Email Protections</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {protections.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
                                <div className="mb-4">{item.icon}</div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                                <p className="text-gray-600 leading-snug">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="mt-20 mb-8 text-center">
                    <p className="text-sm text-gray-500">
                        Built with React, TypeScript, Tailwind CSS & DaisyUI • © 2025 SecurityOps
                    </p>
                </footer>
            </div>
        </>
    );
}
