// import { z } from "zod";
// import FetchDataHelper from "../../helper/FetchDataHelper";
// import { CheckingResultSchema } from "../../schema/checkingResult.schema";
// import { useEffect, useState } from "react";
// import { FaExclamationTriangle, FaChevronDown, FaQuestionCircle } from "react-icons/fa"; // Importing icons
// import { Button } from "../../components/Button";
// import { Menu } from "../../components/Menu";
// import { useNavigate } from "react-router-dom";


// const HomePage = () => {
//     const navigate = useNavigate();
//     const [domain, setDomain] = useState<string>("");
//     const [inputError, setInputError] = useState<boolean>(false);
//     const [selectedType, setSelectedType] = useState<string>("light");
//     const [isHelpOpen, setIsHelpOpen] = useState(false);

//     const { fetchData: fetchChecking, ...ResultData } = FetchDataHelper<z.infer<typeof CheckingResultSchema>>();

//     const handleCheck = () => {
//         if (!domain.trim()) {
//             setInputError(true);
//             return;
//         }

//         setInputError(false);
//         fetchChecking({
//             url: "/check_domain",
//             method: "POST",
//             schema: CheckingResultSchema,
//             axiosConfig: {
//                 data: {
//                     domain: domain.trim(),
//                     scan_type: selectedType,
//                 },
//             },
//         });
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setDomain(e.target.value);
//         if (e.target.value.trim() !== "") {
//             setInputError(false); // Remove error as user starts typing
//         }
//     };

//     const scanOptions = [
//         { value: "light", label: "Light Scan" },
//         { value: "medium", label: "Medium Scan" },
//         { value: "deep", label: "Deep Scan" },
//     ];

//     useEffect(() => {
//         if (ResultData.success) {
//             navigate('/scan-result', { state: { data: ResultData.data?.data } });
//         }
//     }, [ResultData.success]);


//     return (
//         <>
//             <div className="h-full w-full flex flex-col items-center justify-center space-y-8 p-4 sm:p-6">
//                 <div className="text-center space-y-2">
//                     <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
//                         <span>GamblingScan</span>
//                         <span className="text-green-600 ml-1">.io</span>
//                     </h1>
//                     <p className="italic text-xs sm:text-sm">
//                         Scan your domain to detect online gambling defacement
//                     </p>
//                 </div>

//                 <div className="w-full max-w-sm sm:max-w-md space-y-6">
//                     <div className="relative">
//                         <input
//                             type="text"
//                             placeholder="Input domain (e.g., domain.go.id)"
//                             value={domain}
//                             disabled={ResultData.loading}
//                             onChange={handleInputChange}
//                             className={`px-4 py-2 w-full border ${inputError ? "shadow-red-500" : "border-black "} rounded-md shadow-md transition focus:outline-none focus:shadow-xs`}
//                         />
//                         {inputError && (
//                             <div className="absolute left-0 top-full mt-2 bg-gradient-to-r from-red-400 to-red-600 text-white text-sm p-2 rounded-md flex items-center shadow-lg animate-fade-in">
//                                 <FaExclamationTriangle className="mr-2" />
//                                 Please enter a valid domain to scan.
//                             </div>
//                         )}
//                     </div>
//                     <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
//                         <Menu>
//                             <Menu.Trigger asChild>
//                                 <Button
//                                     className={`px-4 py-2 rounded-md w-full sm:w-auto ${ResultData.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
//                                     disabled={ResultData.loading}
//                                 >
//                                     {selectedType === "light"
//                                         ? "Light Scan"
//                                         : selectedType === "medium"
//                                             ? "Medium Scan"
//                                             : selectedType === "deep"
//                                                 ? "Deep Scan"
//                                                 : "Select Scan Type"}
//                                     <FaChevronDown className="ml-2 inline-block" />
//                                 </Button>
//                             </Menu.Trigger>
//                             <Menu.Content className="min-w-36">
//                                 <Menu.Item onClick={() => setSelectedType('light')}>Light Scan</Menu.Item>
//                                 <Menu.Item onClick={() => setSelectedType('medium')}>Medium Scan</Menu.Item>
//                                 <Menu.Item onClick={() => setSelectedType('deep')}>Deep Scan</Menu.Item>
//                             </Menu.Content>
//                         </Menu>


//                         <Button
//                             onClick={handleCheck}
//                             disabled={ResultData.loading}
//                             className={`px-4 py-2 rounded-md w-full sm:w-auto ${ResultData.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
//                         >
//                             {ResultData.loading ? "Checking..." : "Scan Domain"}
//                         </Button>
//                     </div>
//                 </div>

//                 {/* {ResultData.success && Array.isArray(ResultData.data?.data) && ResultData.data.data.length > 0 && (
//                     <div className="w-full max-w-5xl">
//                         <Table columns={columns} data={ResultData.data.data} actions={actions} />
//                     </div>
//                 )} */}
//             </div>

//             {/* Help Center */}
//             <div className="fixed bottom-4 right-4">
//                 <button
//                     className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 border border-black shadow-md transition focus:outline-none focus:shadow-xs"
//                     onClick={() => setIsHelpOpen(!isHelpOpen)}
//                 >
//                     <FaQuestionCircle className="text-xl text-gray-700" />
//                 </button>
//             </div>

//             {isHelpOpen && (
//                 <div className="fixed bottom-16 right-4 bg-white shadow-lg p-4 rounded-md w-64 sm:w-64">
//                     <h3 className="font-semibold text-lg mb-2">Help Center</h3>
//                     <ul className="text-sm text-gray-700 space-y-1">
//                         {scanOptions.map((option) => (
//                             <li key={option.value}>
//                                 <strong>{option.label}:</strong> Explanation about this scan type.
//                             </li>
//                         ))}
//                     </ul>
//                     <button
//                         className="mt-3 bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
//                         onClick={() => setIsHelpOpen(false)}
//                     >
//                         Close
//                     </button>
//                 </div>
//             )}

//         </>
//     );
// };

// export default HomePage;
