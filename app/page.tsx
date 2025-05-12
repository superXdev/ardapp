"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

// TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: Record<string, unknown>;
  }
}
import HeroSection from "@/components/hero-section";
import NewDramaForm from "@/components/new-drama-form";
import DramaFeed from "@/components/drama-feed";
import OwnerActions from "@/components/owner-actions";
import Pagination from "@/components/pagination";
import type { Drama, Topic } from "@/lib/types";
import { getCurrentWalletAddress, getDrama, isContractOwner, tambahTopikDrama as addTopicToContract, hapusTopikDrama as deleteTopicFromContract } from "@/lib/web3";
import { useAppKitAccount } from "@reown/appkit/react";

export default function Home() {
   const { address, isConnected } = useAppKitAccount();
   const [isOwner, setIsOwner] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const dramasPerPage = 5;

   const [dramas, setDramas] = useState<Drama[] | null>(null);
   const [isLoadingTopics, setIsLoadingTopics] = useState(false);

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

   const tambahTopikDrama = async (
      dramaId: string,
      type: "link" | "image" | "text",
      content: string
   ) => {
      if (!address || !dramas) return;

      try {
         // Check if window.ethereum is available
         if (!window.ethereum) {
            throw new Error("MetaMask or another wallet provider is required");
         }

         // Get the signer from the window.ethereum provider
         const provider = new ethers.BrowserProvider(window.ethereum as any);
         const signer = await provider.getSigner();

         // Prepare content based on the selected type
         let processedContent = content;
         
         // For links - ensure they have the proper protocol prefix
         if (type === "link" && !content.startsWith("http://") && !content.startsWith("https://")) {
            processedContent = `https://${content}`;
         }
         
         // Add the type markers for explicit content type tracking
         if (type === "link") {
            processedContent = `__LINK__:${processedContent}`;
         } else if (type === "text") {
            processedContent = `__TEXT__:${processedContent}`;
         }
         // No prefix needed for images - they're detected by content type
         
         // Send to the blockchain
         const success = await addTopicToContract(dramaId, processedContent, signer);

         if (success) {
            // Optimistically update UI with the properly processed content
            // We need to use the same processing logic as in the backend
            let displayContent = processedContent;
            
            // Remove any special prefixes we added
            if (displayContent.startsWith('__LINK__:')) {
               displayContent = displayContent.substring(9);
            } else if (displayContent.startsWith('__TEXT__:')) {
               displayContent = displayContent.substring(9);
            }
            
            const newTopic: Topic = {
               id: Math.random().toString(36).substring(2, 9), // This will be replaced on refresh
               type,
               content: displayContent, // Use the processed content without prefixes
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

            // Refresh data after a short delay to get the actual topic ID from blockchain
            setIsLoadingTopics(true);
            setTimeout(async () => {
               try {
                  const updatedDramas = await getDrama();
                  setDramas(updatedDramas);
               } catch (error) {
                  console.error("Error refreshing dramas:", error);
               } finally {
                  setIsLoadingTopics(false);
               }
            }, 2000);
         }
      } catch (error) {
         console.error("Error adding topic:", error);
         alert("Failed to add topic. See console for details.");
      }
   };

   const hapusTopikDrama = async (dramaId: string, topicId: string) => {
      if (!dramas || !address) return;

      try {
         // Check if window.ethereum is available
         if (!window.ethereum) {
            throw new Error("MetaMask or another wallet provider is required");
         }

         // Get the signer from the window.ethereum provider
         const provider = new ethers.BrowserProvider(window.ethereum as any);
         const signer = await provider.getSigner();

         // Call the smart contract function
         const success = await deleteTopicFromContract(dramaId, topicId, signer);

         if (success) {
            // Optimistically update UI
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

            // Refresh data after a short delay
            setIsLoadingTopics(true);
            setTimeout(async () => {
               try {
                  const updatedDramas = await getDrama();
                  setDramas(updatedDramas);
               } catch (error) {
                  console.error("Error refreshing dramas:", error);
               } finally {
                  setIsLoadingTopics(false);
               }
            }, 2000);
         }
      } catch (error) {
         console.error("Error deleting topic:", error);
         alert("Failed to delete topic. See console for details.");
      }
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
               isLoadingTopics={isLoadingTopics}
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
