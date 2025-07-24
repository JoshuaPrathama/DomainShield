import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleNavigation = (section: "Scanning" | "HowItWorks" | "Developers") => {
    if (window.location.pathname !== "/") {
      localStorage.setItem("scrollTo", section);
      navigate("/");
    } else {
      if (section === "Scanning") window.scrollToScanning?.();
      if (section === "HowItWorks") window.scrollToHowItWorks?.();
      if (section === "Developers") window.scrollToDevelopers?.();
    }
  };

  return (
    <header className="fixed z-50 inset-x-0 top-0 mx-auto w-full max-w-screen-sm border border-gray-100 bg-white py-3 shadow backdrop-blur-lg sm:top-6 sm:rounded-3xl lg:max-w-screen-sm">
      <div className="px-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex shrink-0">
            <a
              aria-current="page"
              className="flex items-center space-x-3"
              href="/"
              onClick={() => localStorage.removeItem("scrollTo")} // Optional: clear scroll intent
            >
              <img
                src="/assets/domainshield.png"
                alt="DomainShield Logo"
                className="w-[40px] h-[40px] object-contain"
              />
            </a>
          </div>

          {/* Navigation Links */}
          <div className="items-justify-gap-5">
            <button
              className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => handleNavigation("Scanning")}
            >
              Scanning
            </button>
            <button
              className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => handleNavigation("HowItWorks")}
            >
              Our Services
            </button>
            <button
              className="inline-block rounded-lg px-2 py-1 text-sm font-medium text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => handleNavigation("Developers")}
            >
              Developers
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
