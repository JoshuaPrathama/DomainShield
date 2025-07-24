import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6">
            <div className="container mx-auto flex flex-col items-center">
                <div className="flex space-x-6 mb-4">
                    <a href="#" className="text-gray-400 hover:text-white transition">
                        <FaFacebook size={24} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition">
                        <FaTwitter size={24} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition">
                        <FaInstagram size={24} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition">
                        <FaLinkedin size={24} />
                    </a>
                </div>
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} YourCompany. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
