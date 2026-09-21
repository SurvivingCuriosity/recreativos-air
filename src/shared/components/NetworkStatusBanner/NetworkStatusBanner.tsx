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
      role="status"
      aria-live="polite"
      className={`fixed top-0 left-0 z-50 w-full py-2 text-center text-sm font-medium text-white shadow-md transition-all duration-500 ${
        isOnline ? "bg-success-solid" : "animate-pulse bg-destructive-solid"
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
