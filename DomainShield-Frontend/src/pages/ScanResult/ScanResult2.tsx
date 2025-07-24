import { useLocation, useNavigate } from "react-router-dom";
import CustomPieChart from "../../components/PieChartComponents";
import { motion } from "framer-motion";
import { CheckingResultSchema } from "../../schema/checkingResult.schema";
import { z } from "zod";
import DomainRecordCard from "../../components/DomainRecordCard";

const ScanResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scanData: z.infer<typeof CheckingResultSchema> = location.state?.data;

  if (!scanData) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-10 bg-white text-gray-900">
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Scan Results Available</h2>
          <p className="text-gray-600 mb-8">Please perform a new scan to view results.</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all"
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    );
  }

  const generateReport = () => {
    navigate("/generate-report", { state: { data: scanData } });
  };

  if (scanData.total_urls === 0 || scanData.compromised_urls === 0) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-10 bg-white text-gray-900">
        {/* Scan Result Section */}
        <div className="w-full flex flex-col mt-20 sm:flex-row sm:flex-wrap gap-8 justify-center items-stretch">
          {/* Chart Container */}
          <div className="w-full sm:max-w-[250px] sm:flex-grow bg-white flex-1 p-6 rounded-2xl shadow-lg flex items-center justify-center border border-blue-200 min-h-[250px]">
            <CustomPieChart
              totalData={scanData.total_urls}
              matchedData={scanData.compromised_urls}
            />
          </div>

          {/* Safe Information */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full sm:max-w-[650px] sm:flex-grow bg-white flex-1 p-8 rounded-2xl shadow-lg border border-blue-200 min-h-[250px] flex flex-col"
          >
            <h2 className="text-2xl font-bold text-blue-800">
              No Compromised URLs Found
            </h2>
            <p className="mt-4 text-gray-700 leading-relaxed flex-grow">
              Selamat! Tidak ditemukan URL yang mengandung konten perjudian
              atau tanda-tanda defacement pada domain ini. Namun, tetap pantau
              secara rutin untuk menjaga keamanan dan integritas website Anda.
            </p>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 bg-blue-800 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-900 transition-all border border-blue-800"
            >
              Back to Home
            </motion.button>
          </motion.div>
        </div>

        {/* Domain Security Scan */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-300 max-w-[930px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
          >
            🔍 Domain Security Scan
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              {
                label: "SPF",
                level: scanData.domain_scan.spf_level,
                description: "Sender Policy Framework",
              },
              {
                label: "DKIM",
                level: scanData.domain_scan.dkim_level,
                description: "DomainKeys Identified Mail",
              },
              {
                label: "DMARC",
                level: scanData.domain_scan.dmarc_level,
                description: "Domain-based Message Authentication",
              },
            ].map((item, idx) => {
              const imageMap: Record<string, string> = {
                High: "/assets/status_valid.svg",
                Medium: "/assets/status_warning.svg",
                Low: "/assets/status_invalid.svg",
              };

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <DomainRecordCard
                    imageSrc={imageMap[item.level] || imageMap["Low"]}
                    altText={item.level}
                    label={item.label}
                    description={`${item.description} - ${item.level} Security`}
                  />
                </motion.div>
              );
            })}
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed text-sm">
            SPF, DKIM, dan DMARC adalah protokol keamanan email penting yang membantu mencegah spoofing, phishing, dan penyalahgunaan domain Anda.{" "}
            {scanData.domain_scan.spf_level === "High" &&
              scanData.domain_scan.dkim_level === "High" &&
              scanData.domain_scan.dmarc_level === "High" ? (
              <>Seluruh protokol telah dikonfigurasi dengan sangat baik. Domain Anda berada dalam kondisi <strong>aman</strong> untuk komunikasi email.</>
            ) : (
              <>
                Berdasarkan hasil pemindaian:
                <ul className="list-disc ml-6 mt-2 text-sm text-gray-700 space-y-1">
                  {scanData.domain_scan.spf_level === "Low" && (
                    <li>
                      <strong>SPF:</strong> Tidak ditemukan atau terlalu permisif (mengandung <code>+all</code>). Ini sangat berisiko terhadap pemalsuan email.
                    </li>
                  )}
                  {scanData.domain_scan.spf_level === "Medium" && (
                    <li>
                      <strong>SPF:</strong> Ditemukan namun menggunakan <code>~all</code>. Konfigurasi ini masih mengizinkan spoofing terbatas. Perlu diperketat.
                    </li>
                  )}
                  {scanData.domain_scan.dkim_level === "Low" && (
                    <li>
                      <strong>DKIM:</strong> Tidak ditemukan. Email dari domain Anda tidak dapat diverifikasi keasliannya.
                    </li>
                  )}
                  {scanData.domain_scan.dmarc_level === "Low" && (
                    <li>
                      <strong>DMARC:</strong> Tidak tersedia atau hanya <code>p=none</code>. Domain Anda tidak memblokir email palsu sama sekali.
                    </li>
                  )}
                  {scanData.domain_scan.dmarc_level === "Medium" && (
                    <li>
                      <strong>DMARC:</strong> Menggunakan <code>p=quarantine</code>. Email mencurigakan diarahkan ke spam, tapi masih berisiko. Disarankan <code>p=reject</code>.
                    </li>
                  )}
                </ul>
                <span className="block mt-2">
                  Mohon periksa dan perbarui konfigurasi DNS untuk meningkatkan keamanan dan reputasi domain Anda.
                </span>
              </>
            )}
          </p>
        </div>

      </div>
    );
  }


  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 bg-white text-gray-900">
      <div className="w-full flex flex-col mt-20 sm:flex-row sm:flex-wrap gap-8 justify-center items-stretch">
        {/* Chart Container */}
        <div className="w-full sm:max-w-[250px] sm:flex-grow bg-gray-100 flex-1 p-6 rounded-2xl shadow-lg flex items-center justify-center border border-gray-300 min-h-[250px]">
          <CustomPieChart
            totalData={scanData.total_urls}
            matchedData={scanData.compromised_urls}
          />
        </div>

        {/* Defacement Information */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full sm:max-w-[650px] sm:flex-grow bg-gray-100 flex-1 p-8 rounded-2xl shadow-lg border border-gray-300 min-h-[250px] flex flex-col"
        >
          <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
            <span>⚠️</span> Domain Abuse Detected!
          </h2>
          <p className="mt-4 text-gray-700 leading-relaxed flex-grow">
            Domain ini telah terkompromi oleh konten perjudian online.
            Terdapat subdomain yang mengandung konten perjudian atau
            telah mengalami defacement. Kami merekomendasikan tindakan segera
            untuk mengamankan domain Anda dan mencegah penyalahgunaan lebih lanjut.
          </p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateReport}
            className="mt-6 px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-red-700 transition-all border border-red-500"
          >
            📝 Generate Report
          </motion.button>
        </motion.div>
      </div>

      {/* Domain Security Scan */}
      {/* Domain Security Scan */}
      <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-300 max-w-[930px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
        >
          🔍 Domain Security Scan
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            {
              label: "SPF",
              level: scanData.domain_scan.spf_level,
              description: "Sender Policy Framework",
            },
            {
              label: "DKIM",
              level: scanData.domain_scan.dkim_level,
              description: "DomainKeys Identified Mail",
            },
            {
              label: "DMARC",
              level: scanData.domain_scan.dmarc_level,
              description: "Domain-based Message Authentication",
            },
          ].map((item, idx) => {
            const imageMap: Record<string, string> = {
              High: "/assets/status_valid.svg",
              Medium: "/assets/status_warning.svg",
              Low: "/assets/status_invalid.svg",
            };

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <DomainRecordCard
                  imageSrc={imageMap[item.level] || imageMap["Low"]}
                  altText={item.level}
                  label={item.label}
                  description={`${item.description} - ${item.level} Security`}
                />
              </motion.div>
            );
          })}
        </div>

        <p className="mt-6 text-gray-700 leading-relaxed text-sm">
          SPF, DKIM, dan DMARC adalah protokol keamanan email penting yang membantu mencegah spoofing, phishing, dan penyalahgunaan domain Anda.{" "}
          {scanData.domain_scan.spf_level === "High" &&
            scanData.domain_scan.dkim_level === "High" &&
            scanData.domain_scan.dmarc_level === "High" ? (
            <>Seluruh protokol telah dikonfigurasi dengan sangat baik. Domain Anda berada dalam kondisi <strong>aman</strong> untuk komunikasi email.</>
          ) : (
            <>
              Berdasarkan hasil pemindaian:
              <ul className="list-disc ml-6 mt-2 text-sm text-gray-700 space-y-1">
                {scanData.domain_scan.spf_level === "Low" && (
                  <li>
                    <strong>SPF:</strong> Tidak ditemukan atau terlalu permisif (mengandung <code>+all</code>). Ini sangat berisiko terhadap pemalsuan email.
                  </li>
                )}
                {scanData.domain_scan.spf_level === "Medium" && (
                  <li>
                    <strong>SPF:</strong> Ditemukan namun menggunakan <code>~all</code>. Konfigurasi ini masih mengizinkan spoofing terbatas. Perlu diperketat.
                  </li>
                )}
                {scanData.domain_scan.dkim_level === "Low" && (
                  <li>
                    <strong>DKIM:</strong> Tidak ditemukan. Email dari domain Anda tidak dapat diverifikasi keasliannya.
                  </li>
                )}
                {scanData.domain_scan.dmarc_level === "Low" && (
                  <li>
                    <strong>DMARC:</strong> Tidak tersedia atau hanya <code>p=none</code>. Domain Anda tidak memblokir email palsu sama sekali.
                  </li>
                )}
                {scanData.domain_scan.dmarc_level === "Medium" && (
                  <li>
                    <strong>DMARC:</strong> Menggunakan <code>p=quarantine</code>. Email mencurigakan diarahkan ke spam, tapi masih berisiko. Disarankan <code>p=reject</code>.
                  </li>
                )}
              </ul>
              <span className="block mt-2">
                Mohon periksa dan perbarui konfigurasi DNS untuk meningkatkan keamanan dan reputasi domain Anda.
              </span>
            </>
          )}
        </p>
      </div>


      {/* URL List Table */}
      <div className="mt-12 p-6 bg-gray-100 rounded-2xl shadow-lg border border-gray-300 max-w-[930px] mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📄 List of Affected URLs
        </h2>
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="p-3 border">No</th>
                <th className="p-3 border">URL</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {scanData.data?.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{row.Original_url}</td>
                  <td className="p-3 border text-red-600 font-semibold">
                    Defaced
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScanResultPage;
