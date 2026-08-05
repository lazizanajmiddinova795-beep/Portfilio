"use client";

import { Toaster } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className:
          "group bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-800/50 shadow-[10px_10px_30px_#d1d9e6,-10px_-10px_30px_#ffffff] dark:shadow-[5px_5px_20px_#050805,-5px_-5px_20px_#0f160f] rounded-2xl text-gray-900 dark:text-white flex items-center gap-3 px-4 py-3 font-medium",
        classNames: {
          success: "text-green-600 dark:text-green-400",
          error: "text-red-600 dark:text-red-400",
          warning: "text-amber-600 dark:text-amber-400",
          info: "text-blue-600 dark:text-blue-400",
        },
      }}
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
      }}
    />
  );
}
