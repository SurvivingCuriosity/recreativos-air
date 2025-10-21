import { useEffect, useState } from "react";

export const NetworkStatusBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  const [reconnected, setReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setReconnected(true);
      setShowBanner(true);

      // Oculta el mensaje de reconexión después de 3s
      setTimeout(() => {
        setShowBanner(false);
        setReconnected(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 text-center py-2 text-sm font-medium text-white shadow-md transition-all duration-500 ${
        isOnline
          ? "bg-green-600 opacity-100"
          : "bg-red-600 opacity-100 animate-pulse"
      }`}
    >
      {isOnline
        ? reconnected
          ? "✅ Conexión restablecida"
          : null
        : "🔌 Sin conexión a internet"}
    </div>
  );
};
