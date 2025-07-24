import React from "react";

interface DefaultBoxProps {
    children: React.ReactNode;
    className?: string;
}

const DefaultBox: React.FC<DefaultBoxProps> = ({ children, className }) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.05),_0_1px_3px_rgba(0,0,0,0.1)] border ${className}`}
        >
            {children}
        </div>
    );
};

export default DefaultBox;
