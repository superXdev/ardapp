"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Flame } from "lucide-react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Eip1193Provider, ethers } from "ethers";
import { newDrama } from "@/lib/web3";

interface NewDramaFormProps {
   onSubmit: (kode: string, deskripsi: string) => void;
}

export default function NewDramaForm({ onSubmit }: NewDramaFormProps) {
   const [kode, setKode] = useState("");
   const [deskripsi, setDeskripsi] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [alertMessage, setAlertMessage] = useState<string | null>(null);
   const [alertType, setAlertType] = useState<"success" | "error" | "info">(
      "info"
   );
   const { walletProvider } = useAppKitProvider("eip155");

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      const provider = new BrowserProvider(walletProvider as Eip1193Provider);
      const signer = await provider.getSigner();

      if (!kode.trim() || !deskripsi.trim()) {
         setAlertMessage(
            "Please fill in both Title Drama and Description Drama"
         );
         setAlertType("error");
         setIsLoading(false);
         return;
      }

      const result = await newDrama(kode, deskripsi, signer);

      if (!result) {
         setAlertMessage("Failed to add drama. Please try again.");
         setAlertType("error");
         setIsLoading(false);
         return;
      }

      setAlertMessage("Successfully submitted drama!");
      setAlertType("success");
      onSubmit(kode, deskripsi);

      setKode("");
      setDeskripsi("");
      setIsLoading(false);
   };

   return (
      <div className="space-y-4 mb-4">
         {alertMessage && (
            <div
               className={`p-4 rounded-lg ${
                  alertType === "success"
                     ? "bg-green-500/10 text-green-400"
                     : alertType === "error"
                     ? "bg-red-500/10 text-red-400"
                     : "bg-blue-500/10 text-blue-400"
               }`}
            >
               {alertMessage}
            </div>
         )}
         <Card className="mb-8 bg-[#2a1b3d]/60 backdrop-blur-md border-[#6a11cb]/20 shadow-xl">
            <CardHeader>
               <CardTitle className="text-2xl font-bold">
                  Post New Drama
               </CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <Input
                        placeholder="Title Drama"
                        value={kode}
                        onChange={(e) => setKode(e.target.value)}
                        className="bg-white/5 border-white/10 text-xl font-bold placeholder:text-white/30"
                     />
                  </div>

                  <div>
                     <Textarea
                        placeholder="Description Drama"
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        className="bg-white/5 border-white/10 min-h-[100px] placeholder:text-white/30"
                     />
                  </div>

                  <Button
                     type="submit"
                     disabled={isLoading}
                     className="w-full bg-gradient-to-r from-[#6a11cb] to-[#f9d423] hover:from-[#5a0cb6] hover:to-[#e9c413] text-white font-bold py-3 rounded-xl transition-all duration-300"
                  >
                     {isLoading ? (
                        <div className="flex items-center justify-center">
                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                           Loading...
                        </div>
                     ) : (
                        <>
                           <Flame className="w-5 h-5 mr-2" />
                           Submit Drama
                        </>
                     )}
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
