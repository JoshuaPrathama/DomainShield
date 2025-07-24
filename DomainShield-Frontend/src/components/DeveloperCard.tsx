import React from "react";

interface DeveloperCardProps {
    name: string;
    role: string;
    image: string;
    linkedin: string;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ name, role, image, linkedin }) => {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center transition-transform transform hover:-translate-y-2 hover:shadow-2xl duration-300">
            <div className="relative w-24 h-24 mx-auto">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full rounded-full object-cover border-4 border-gray-300 hover:border-blue-500 transition duration-300"
                />
            </div>
            <h2 className="mt-4 text-lg font-bold text-gray-900">{name}</h2>
            <p className="text-sm text-gray-600">{role}</p>
            <div className="flex justify-center mt-3">
                <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-800 transition duration-300"
                >
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M20 0H4C1.8 0 0 1.8 0 4v16c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4zM8 19H5V9h3v10zM6.5 7.5C5.1 7.5 4 6.4 4 5s1.1-2.5 2.5-2.5S9 3.6 9 5s-1.1 2.5-2.5 2.5zM20 19h-3v-5.6c0-1.3-1.1-2.4-2.4-2.4-1.3 0-2.6 1.1-2.6 2.4V19h-3V9h3v1.4c.8-.9 2-1.4 3.2-1.4 2.3 0 4.2 1.9 4.2 4.2V19z" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default DeveloperCard;
