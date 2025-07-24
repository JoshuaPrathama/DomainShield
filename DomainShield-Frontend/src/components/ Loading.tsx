import React, { useEffect, useState } from "react";

type Props = {
    isOpen: boolean;
};

const statusMessages = [
    "⏳ Mengecek konfigurasi DNS (DMARC, SPF, DKIM)...",
    "🔎 Memindai halaman domain...",
    "📂 Menganalisis struktur URL dan redirect...",
    "🧠 Mengklasifikasi konten mencurigakan...",
    "🖼️ Mengambil tangkapan layar halaman...",
    "📝 Menyiapkan laporan akhir...",
];

const LoadingPopup: React.FC<Props> = ({ isOpen }) => {
    const [messageIndex, setMessageIndex] = useState(0);

    // Disable scroll on <body> when loading
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setMessageIndex(0);
            const interval = setInterval(() => {
                setMessageIndex((prev) => (prev + 1) % statusMessages.length);
            }, 8000);

            return () => {
                clearInterval(interval);
                document.body.style.overflow = "auto"; // Restore scroll
            };
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[320px]">
                <div className="animate-spin mb-4 h-10 w-10 mx-auto border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Scanning domain...</h2>
                <p className="text-sm text-gray-600 min-h-[40px]">
                    {statusMessages[messageIndex]}
                </p>

                <div className="mt-4 text-xs text-gray-500 italic">
                    Estimasi waktu bervariasi tergantung jumlah halaman dan kecepatan server.
                </div>
            </div>
        </div>
    );
};

export default LoadingPopup;
