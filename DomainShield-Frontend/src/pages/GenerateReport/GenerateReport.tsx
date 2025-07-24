import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { z } from "zod";
import { CheckingResultSchema } from "../../schema/checkingResult.schema";
import { useLocation } from "react-router-dom";


// Komponen Konten PDF
const PDFContent = ({
  scanData,
}: {
  scanData: z.infer<typeof CheckingResultSchema> | undefined;
}) => (
  <div className="p-10 bg-white text-black rounded-2xl shadow-lg max-w-4xl mx-auto">
    {/* Header */}
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-blue-600">Domain Shield</h1>
      <p className="text-sm text-gray-500">Scan Result</p>
    </header>

    {/* Informasi Utama */}
    <section className="space-y-4">
      {[
        { label: "Tanggal Pemindaian", value: new Date().toLocaleDateString("id-ID") },
        { label: "Domain yang Dipindai", value: scanData?.domain_scan?.domain || "-" },
        { label: "Status Pemindaian", value: "Berhasil" },
      ].map((item, index) => (
        <div className="flex items-center" key={index}>
          <h4 className="w-56 font-semibold">{item.label}</h4>
          <p>: {item.value}</p>
        </div>
      ))}
    </section>

    {/* Box Ringkasan */}
    <section className="relative mt-10">
      <div className="border border-black rounded-lg p-4">
        <div className="absolute -top-4 left-4 bg-white px-3 font-semibold">
          Ringkasan
        </div>
        <p className="text-gray-700 leading-relaxed">
          Ditemukan beberapa URL yang terindikasi telah di-deface.
        </p>
      </div>
    </section>

    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Informasi Keamanan (DMARC, SPF, DKIM)</h2>
      <div className="space-y-2 text-sm text-gray-800">
        <div className="flex items-start">
          <span className="w-40 font-semibold">DMARC</span>
          <span>
            : {scanData?.domain_scan.dmarc_level || "-"} —{" "}
            {scanData?.domain_scan.dmarc_level === "High"
              ? "Kebijakan penolakan diterapkan dengan pengaturan lengkap (p=reject, ada rua/ruf/sp)."
              : scanData?.domain_scan.dmarc_level === "Medium"
                ? "Kebijakan DMARC cukup baik (p=reject/quarantine), namun tidak lengkap atau lemah dalam pelaporan."
                : "Kebijakan tidak efektif atau tidak ditemukan (p=none atau tidak ada record)."}
          </span>
        </div>
        <div className="flex items-start">
          <span className="w-40 font-semibold">SPF</span>
          <span>
            : {scanData?.domain_scan.spf_level || "-"} —{" "}
            {scanData?.domain_scan.spf_level === "High"
              ? "Konfigurasi SPF aman tanpa wildcard atau modifier longgar."
              : scanData?.domain_scan.spf_level === "Medium"
                ? "Konfigurasi SPF ditemukan tetapi mengandung wildcard moderat (~all)."
                : "Konfigurasi SPF tidak ditemukan atau terlalu permisif (+all)."}
          </span>
        </div>
        <div className="flex items-start">
          <span className="w-40 font-semibold">DKIM</span>
          <span>
            : {scanData?.domain_scan.dkim_level || "-"} —{" "}
            {scanData?.domain_scan.dkim_level === "High"
              ? "Signature DKIM terdeteksi pada domain dan valid."
              : "DKIM tidak ditemukan — email domain mudah dipalsukan tanpa verifikasi kriptografi."}
          </span>
        </div>
      </div>
    </section>



    {/* List URL */}
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-6">List URL</h2>
      <ul className="list-disc list-inside space-y-2">
        {scanData?.data?.map(
          (url: z.infer<typeof CheckingResultSchema>["data"][0], index) => (
            <li key={index} className="text-blue-600 hover:underline">
              <a
                href={url.Original_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {url.Original_url}
              </a>
            </li>
          ),
        )}
      </ul>
    </section>

    {/* Detail Informasi URL */}
    {scanData?.data?.map(
      (url: z.infer<typeof CheckingResultSchema>["data"][0], index) => (
        <section
          key={index}
          className="pt-10"
          style={{ pageBreakBefore: "always" }}
        >
          <h2 className="text-2xl font-bold mb-6">Detail Informasi URL</h2>
          <div className="border border-gray-300 rounded-lg p-6 mb-8 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">URL {index + 1}</h3>

            <div className="space-y-2">
              <p>
                <strong>Original URL:</strong>{" "}
                <a
                  href={url.Original_url}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.Original_url}
                </a>
              </p>
              <p>
                <strong>Redirect URL:</strong>{" "}
                <a
                  href={url.Redirect_url}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.Redirect_url}
                </a>
              </p>
              <p>
                <strong>Compromised:</strong> {url.compromised}
              </p>

              <div>
                <p>
                  <strong>External Links:</strong>
                </p>
                <ul className="list-disc list-inside pl-5">
                  {url.external_links.map(
                    (
                      link: z.infer<
                        typeof CheckingResultSchema
                      >["data"][0]["external_links"][0],
                      linkIndex,
                    ) => (
                      <li key={linkIndex}>
                        <a
                          href={link}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </div>

              {url.screenshot && typeof url.screenshot === "string" && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Screenshot Bukti:</h4>
                  <img
                    src={`data:image/png;base64,${url.screenshot.trim()}`}
                    alt={`Screenshot of ${url.Original_url ?? ""}`}
                    className="rounded-lg shadow-md border border-gray-300 max-w-full"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      ),
    )}

    {/* Footer */}
    <footer className="mt-12 text-center text-gray-500 text-sm">
      © 2025 Your Company - Semua Hak Dilindungi
    </footer>
  </div>
);

// Komponen Utama
export default function PDFPage() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const scanData: z.infer<typeof CheckingResultSchema> = location.state
    ?.data || { urls: [] };

  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: "Laporan-Bulanan",
  });

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Download PDF dari HTML</h1>

      <div ref={pdfRef}>
        <PDFContent scanData={scanData} />
      </div>

      <button
        onClick={() => pdfRef.current && handlePrint()}
        className="mt-8 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Download PDF
      </button>
    </div>
  );
}
