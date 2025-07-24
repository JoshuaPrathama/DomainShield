import { motion } from "framer-motion";
import { IconType } from "react-icons"; // Import type untuk icon

interface ServiceCardProps {
    title: string;
    description: string;
    linkText: string;
    linkHref?: string;
    Icon: IconType;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, linkText, linkHref, Icon }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
        >
            <Icon className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3" />
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h5>
            <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">{description}</p>
            <a href={linkHref} className="inline-flex font-medium items-center text-blue-600 hover:underline">
                {linkText}
            </a>
        </motion.div>
    );
};

export default ServiceCard;
