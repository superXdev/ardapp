"use client";

import { useState, useEffect } from "react";
import { Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export default function HeroSection() {
   const [isGlitching, setIsGlitching] = useState(false);
   const { address, isConnected } = useAppKitAccount();
   const { open } = useAppKit();

   const onConnectWallet = async () => {
      if (isConnected) {
         await open({ view: "Account" });
         return;
      }

      await open({ view: "Connect" });
   };

   useEffect(() => {
      const interval = setInterval(() => {
         setIsGlitching(true);
         setTimeout(() => setIsGlitching(false), 200);
      }, 3000);

      return () => clearInterval(interval);
   }, []);

   return (
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6a11cb] to-[#2575fc] p-8 mb-8">
         <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>

         {/* Doodle Art Background */}
         <div className="absolute inset-0 opacity-25 mix-blend-overlay">
            <img
               src="/crypto-doodles-pattern-enhanced.png"
               alt=""
               className="w-full h-full object-cover"
               aria-hidden="true"
            />
         </div>

         <div className="relative z-10">
            <h1
               className={`text-5xl md:text-7xl font-bold mb-2 font-mono ${
                  isGlitching ? "glitch" : ""
               }`}
            >
               Arsip Drama
            </h1>

            <p className="text-xl md:text-2xl mb-6 font-light">
               Where blockchain meets online chaos
            </p>

            <Button
               onClick={onConnectWallet}
               className="relative group bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border border-white/20 rounded-full px-6 py-2 transition-all duration-300"
            >
               <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></span>
               <Wallet className="w-4 h-4 mr-2 inline-block" />
               {isConnected && address
                  ? `Connected: ${address.substring(
                       0,
                       6
                    )}...${address.substring(address.length - 4)}`
                  : "Connect Wallet"}
            </Button>
         </div>

         <style jsx>{`
            .glitch {
               position: relative;
               animation: glitch 500ms linear;
            }

            @keyframes glitch {
               0% {
                  transform: translate(0);
               }
               20% {
                  transform: translate(-2px, 2px);
               }
               40% {
                  transform: translate(-2px, -2px);
               }
               60% {
                  transform: translate(2px, 2px);
               }
               80% {
                  transform: translate(2px, -2px);
               }
               100% {
                  transform: translate(0);
               }
            }

            .crypto-symbol {
               position: absolute;
               font-size: 2rem;
               color: rgba(255, 255, 255, 0.3);
               animation: float 8s ease-in-out infinite;
            }

            @keyframes float {
               0% {
                  transform: translateY(0) rotate(0deg);
               }
               50% {
                  transform: translateY(-15px) rotate(5deg);
               }
               100% {
                  transform: translateY(0) rotate(0deg);
               }
            }
         `}</style>
      </section>
   );
}
