// import { useLocation } from "react-router-dom";
// import { FaExclamationTriangle, FaEye } from "react-icons/fa";
// import Table from "../../components/Table";
// import { Button } from "../../components/Button";
// import { useState } from "react";
// import { z } from "zod";
// import { CheckingResultSchema } from "../../schema/checkingResult.schema";
// import UrlDetailPopup from "../../components/PopupUrlDetail";

// const ScanResultPage = () => {
//     const location = useLocation();
//     const scanData = location.state?.data || [];
//     const [selectedUrl, setSelectedUrl] = useState<z.infer<typeof CheckingResultSchema>["data"][0] | null>(null);
//     const [isPopupOpen, setIsPopupOpen] = useState(false);

//     const columns = [
//         { key: 'Original_url', label: 'Link' },
//         { key: 'Redirect_url', label: 'Redirect To' },
//     ];

//     const actions = [
//         {
//             label: 'View',
//             icon: FaEye,
//             onClick: (row: z.infer<typeof CheckingResultSchema>["data"][0]) => {
//                 setSelectedUrl(row);
//                 setIsPopupOpen(true);
//             },
//         },
//     ];

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center space-y-8 p-4 sm:p-6">
//             <div className="text-center space-y-2">
//                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
//                     <span>Scan Results</span>
//                     <span className="text-green-600 ml-1">.io</span>
//                 </h1>
//                 <p className="italic text-xs sm:text-sm">
//                     View detailed results of your domain scan.
//                 </p>
//             </div>

//             {scanData.length > 0 ? (
//                 <>
//                     <div className="bg-blue-100 text-blue-800 p-4 rounded-md mb-4 shadow-md text-center">
//                         <span className="font-bold text-lg">
//                             Total URLs detected with defacement issues:
//                         </span>
//                         <span className="ml-2 text-2xl font-extrabold text-red-600">
//                             {scanData.length}
//                         </span>
//                     </div>
//                     <div className="w-full max-w-5xl">
//                         <Table columns={columns} data={scanData} actions={actions} />
//                     </div>
//                 </>
//             ) : (
//                 <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-4 rounded-md flex items-center shadow-lg">
//                     <FaExclamationTriangle className="mr-2" />
//                     No results available. Please perform a scan first.
//                 </div>
//             )}

//             <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
//                 <Button
//                     onClick={() => window.history.back()}
//                     className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
//                 >
//                     Back to Home
//                 </Button>
//             </div>

//             {isPopupOpen && selectedUrl && (
//                 <UrlDetailPopup
//                     data={selectedUrl}
//                     onClose={() => setIsPopupOpen(false)}
//                 />
//             )}
//         </div>
//     );
// };

// export default ScanResultPage;
