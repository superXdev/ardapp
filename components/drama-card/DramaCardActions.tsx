import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { hapusDrama } from "@/lib/web3";
import { BrowserProvider, Eip1193Provider } from "ethers";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import type { Drama } from "@/lib/types";

interface DramaCardActionsProps {
   drama: Drama;
   dramaId: string;
   onDeleted?: () => void;
}

export default function DramaCardActions({
   dramaId,
   onDeleted,
   drama,
}: DramaCardActionsProps) {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const { address } = useAppKitAccount();
   const { walletProvider } = useAppKitProvider("eip155");

   const handleDelete = async () => {
      if (!address) {
         setError("Ethereum wallet not found");
         return;
      }
      if (!confirm("Are you sure you want to delete this drama?")) return;
      setLoading(true);
      setError(null);
      try {
         const provider = new BrowserProvider(
            walletProvider as Eip1193Provider
         );
         const signer = await provider.getSigner();
         const success = await hapusDrama(dramaId, signer);
         if (success) {
            if (onDeleted) onDeleted();
         } else {
            setError("Failed to delete drama.");
         }
      } catch (e: any) {
         setError(e?.message || "Failed to delete drama.");
      } finally {
         setLoading(false);
      }
   };

   return (
      address?.toLowerCase() === drama.creator.toLowerCase() && (
         <div className="p-4 bg-black/20 border-t border-white/10 mt-4">
            <Button
               onClick={handleDelete}
               variant="destructive"
               className="w-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:from-[#ff3162] hover:to-[#ff3b1b] text-white font-bold py-2"
               disabled={loading}
            >
               <Trash2 className="w-5 h-5 mr-2" />
               {loading ? "DELETING..." : "DELETE THIS DRAMA"}
            </Button>
            {error && <div className="text-red-400 text-xs mt-2">{error}</div>}
         </div>
      )
   );
}
