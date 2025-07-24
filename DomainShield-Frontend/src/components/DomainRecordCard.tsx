import React from "react";

interface DomainRecordCardProps {
    imageSrc: string;
    altText: string;
    label: string;
    description: string;
}

const DomainRecordCard: React.FC<DomainRecordCardProps> = ({
    imageSrc,
    altText,
    label,
    description,
}) => {
    return (
        <div
            className="bg-white rounded-xl p-4 shadow-md border border-gray-300 cursor-default hover:shadow-lg transition flex flex-col items-center justify-between"
            onClick={() => { }}
        >
            <div className="flex justify-center mb-4">
                <img src={imageSrc} width="86" height="21" alt={altText} />
            </div>
            <p className="text-gray-900 font-bold text-lg text-center mb-2">{label}</p>

            <p className="text-gray-500 text-sm text-center mb-0 h-16 overflow-hidden text-ellipsis hover:h-auto hover:overflow-visible hover:whitespace-normal">
                {description}
            </p>
        </div>
    );
};

export default DomainRecordCard;
