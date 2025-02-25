import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getTransactionStatus } from "../action/get-transaction-status";

declare global {
  interface Window {
    snap: {
      embed: (
        token: string,
        options: {
          embedId: string;
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: (result: any) => void;
        },
      ) => void;
      pay: (token: string, options: { onSuccess: () => void }) => void;
      hide: () => void;
    };
  }
}

export function useSnapPayment(orderId: string, snapToken: string | undefined) {
  const router = useRouter();
  const snapContainerRef = useRef<HTMLDivElement>(null);
  const snapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (snapToken && snapContainerRef.current) {
      const containerId = "snap-container";
      snapContainerRef.current.id = containerId;

      // Cleanup previous instance if exists
      if (snapInstanceRef.current) {
        window.snap.hide();
        snapInstanceRef.current = null;
      }

      const timer = setTimeout(async () => {
        try {
          window.snap.embed(snapToken, {
            embedId: containerId,
            onSuccess: function () {
              // Update to DB
              getTransactionStatus(orderId);
              // Redirect to Daftar Pemain Page
              router.push("/dashboard/daftar-pemain");
            },
            onPending: function () {
              getTransactionStatus(orderId);
            },
            onError: function () {
              getTransactionStatus(orderId);
            },
            onClose: function () {
              getTransactionStatus(orderId);
            },
          });
          snapInstanceRef.current = true;
        } catch (error) {
          console.error("Failed to initialize Snap:", error);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        if (snapInstanceRef.current) {
          window.snap.hide();
        }
      };
    }
  }, [snapToken, orderId, router]);

  return snapContainerRef;
}
