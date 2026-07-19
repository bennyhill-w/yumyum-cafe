import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiDownload, FiX } from "react-icons/fi";
import logoImg from "../../assets/logo.jpg";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("pwa-dismissed")) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-dismissed", "true");
  };

  if (!showPrompt || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 flex items-start gap-4">
          <img
            src={logoImg}
            alt="Yum-Yum Cafe"
            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-gray-900 text-base leading-tight">
              Add to Home Screen
            </p>
            <p className="text-gray-400 text-xs font-sans mt-1 leading-relaxed">
              Install Yum-Yum Cafe for faster ordering — works like an app!
            </p>
            <div className="flex gap-2 mt-3">
              <motion.button
                onClick={handleInstall}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-brand-red text-white font-bold py-2 rounded-xl text-xs font-sans hover:bg-brand-red-dark transition-colors"
              >
                <FiDownload size={13} />
                Install
              </motion.button>
              <button
                onClick={handleDismiss}
                className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-500 font-bold py-2 px-3 rounded-xl text-xs font-sans hover:bg-gray-200 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-300 hover:text-gray-500 flex-shrink-0"
          >
            <FiX size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
