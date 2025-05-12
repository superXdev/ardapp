"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/hero-section";
import NewDramaForm from "@/components/new-drama-form";
import DramaFeed from "@/components/drama-feed";
import OwnerActions from "@/components/owner-actions";
import Pagination from "@/components/pagination";
import type { Drama, Topic } from "@/lib/types";
import { getCurrentWalletAddress, getDrama, isContractOwner } from "@/lib/web3";
import { useAppKitAccount } from "@reown/appkit/react";

export default function Home() {
   const { address, isConnected } = useAppKitAccount();
   const [isOwner, setIsOwner] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const dramasPerPage = 5;

   const [dramas, setDramas] = useState<Drama[] | null>(null);

   useEffect(() => {
      const fetchDrama = async () => {
         const drama = await getDrama();
         setDramas(drama);
      };
      fetchDrama();
   }, []);

   const tambahDramaBaru = (kode: string, deskripsi: string) => {
      if (!address || !dramas) return;

      const newDrama: Drama = {
         id: (dramas.length + 1).toString(),
         kode,
         deskripsi,
         creator: address,
         timestamp: Date.now(),
         topics: [],
      };

      setDramas([newDrama, ...dramas]);
      // Go to first page when adding a new drama
      setCurrentPage(1);
   };

   const tambahTopikDrama = (
      dramaId: string,
      type: "link" | "image",
      content: string
   ) => {
      if (!address || !dramas) return;

      const newTopic: Topic = {
         id: Math.random().toString(36).substring(2, 9),
         type,
         content,
         pembuat: address,
         waktu: Date.now(),
      };

      setDramas(
         dramas.map((drama) => {
            if (drama.id === dramaId) {
               return {
                  ...drama,
                  topics: [...drama.topics, newTopic],
               };
            }
            return drama;
         })
      );
   };

   const hapusTopikDrama = (dramaId: string, topicId: string) => {
      if (!dramas) return;
      setDramas(
         dramas.map((drama) => {
            if (drama.id === dramaId) {
               return {
                  ...drama,
                  topics: drama.topics.filter((topic) => topic.id !== topicId),
               };
            }
            return drama;
         })
      );
   };

   const hapusDrama = (dramaId: string) => {
      if (!dramas) return;
      setDramas(dramas.filter((drama) => drama.id !== dramaId));

      // If we're on the last page and delete the last item, go to previous page
      const totalPages = Math.ceil(dramas.length / dramasPerPage);
      if (
         currentPage > 1 &&
         currentPage === totalPages &&
         dramas.length % dramasPerPage === 1
      ) {
         setCurrentPage(currentPage - 1);
      }
   };

   const destroyContract = () => {
      if (!isOwner) return;
      // In a real app, this would call the contract's self-destruct function
      alert("Contract destroyed! (This is a simulation)");
   };

   // Get current dramas for pagination
   const indexOfLastDrama = currentPage * dramasPerPage;
   const indexOfFirstDrama = indexOfLastDrama - dramasPerPage;
   const currentDramas = dramas
      ? dramas.slice(indexOfFirstDrama, indexOfLastDrama)
      : null;
   const totalPages = dramas ? Math.ceil(dramas.length / dramasPerPage) : 0;

   return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a0b19] to-[#0d0b1f] text-white relative">
         {/* Doodle Art Background */}
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-15 mix-blend-overlay">
               <img
                  src="/web3-doodle-bg-enhanced.png"
                  alt=""
                  className="w-full h-full object-cover"
                  aria-hidden="true"
               />
            </div>
         </div>

         <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
            <HeroSection />

            {isConnected && <NewDramaForm onSubmit={tambahDramaBaru} />}

            <DramaFeed
               dramas={currentDramas}
               walletAddress={address || null}
               onAddTopic={tambahTopikDrama}
               onDeleteTopic={hapusTopikDrama}
               onDeleteDrama={hapusDrama}
            />

            {dramas && dramasPerPage && (
               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
               />
            )}

            {isOwner && <OwnerActions onDestroyContract={destroyContract} />}
         </div>
      </main>
   );
}
