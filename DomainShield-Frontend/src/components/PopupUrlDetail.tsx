import React, { useEffect } from 'react';
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { z } from 'zod';
import { CheckingResultSchema } from '../schema/checkingResult.schema';
import DefaultBox from './DefaultBox';
import { IoIosLink } from "react-icons/io";
import { Button } from './Button';
// import CustomButton from '../Button/CustomButton';

interface UrlDetailPopupProps {
    data: z.infer<typeof CheckingResultSchema>["data"][0] | null;
    onClose: () => void;
}

const UrlDetailPopup: React.FC<UrlDetailPopupProps> = ({ data, onClose }) => {

    const copyToClipboard = () => {
        if (data?.Original_url) {
            navigator.clipboard.writeText(data.Original_url);
            alert("Link copied to clipboard!");
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg pt-6 pb-3 max-w-xl w-full overflow-hidden">
                <div className="flex justify-between items-center mb-4 pr-6 pl-6">
                    <div>
                        <h2 className="text-lg font-bold break-words"> {/* Added break-words to allow wrapping */}
                            Website Url
                        </h2>
                        <a href={data?.Original_url ?? ''} className='text-slate-500'>
                            {data?.Original_url}
                        </a>
                    </div>
                    <button onClick={onClose}>
                        <FaTimes className="text-red-500" size={25} />
                    </button>
                </div>
                <div className="divider"></div>
                <div className='pr-6 pl-6 pb-4 max-h-96 overflow-y-auto'>
                    <h2 className='font-semibold mb-2'>URL Details</h2>
                    <DefaultBox className='p-4 mt-2 !border-2 shadow-none border-slate-300 space-y-6'>
                        <div>
                            <p className='text-slate-500'>Status</p>
                            {/* Status Indicator */}
                            <div className="flex items-center mt-1">
                                {data?.compromised === 'True' && (
                                    <>
                                        <FaExclamationCircle className="text-yellow-500 mr-2" size={20} />
                                        <p>Defacement</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className='text-slate-500'>URL Redirect To</p>
                            <p className='mt-1'>{data?.Redirect_url}</p>
                        </div>
                        {data?.external_links && data.external_links.length > 0 && (
                            <div className='bg-white rounded-lg shadow-sm'>
                                <p className='font-semibold text-slate-500'>External URL</p>
                                <ul className='mt-2 space-y-1'>
                                    {data?.external_links.map((link, index) => (
                                        <li key={index} className='flex items-center text-gray-800 mb-2 space-x-3'>
                                            <button
                                                onClick={copyToClipboard}
                                                className="flex items-center justify-center p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:ring focus:ring-gray-300 focus:outline-none"
                                                title="Copy URL to Clipboard"
                                            >
                                                <IoIosLink size={20} className="text-gray-600" />
                                            </button>
                                            <span className='text-sm'>{link}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </DefaultBox>
                    <div className='mt-1 flex justify-end'>
                        <Button
                            className={`px-4 py-2 rounded-md w-full sm:w-auto 'bg-green-500 hover:bg-green-600'}`}
                        >
                            Generate Report
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrlDetailPopup;
