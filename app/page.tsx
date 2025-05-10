"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/hero-section";
import NewDramaForm from "@/components/new-drama-form";
import DramaFeed from "@/components/drama-feed";
import OwnerActions from "@/components/owner-actions";
import Pagination from "@/components/pagination";
import type { Drama, Topic } from "@/lib/types";
import { getCurrentWalletAddress, isContractOwner } from "@/lib/web3";
import { useAppKitAccount } from "@reown/appkit/react";

export default function Home() {
   const { address, isConnected } = useAppKitAccount();
   const [isOwner, setIsOwner] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const dramasPerPage = 5;

   const [dramas, setDramas] = useState<Drama[] | null>([
      {
         id: "1",
         kode: "Drama Royale",
         deskripsi:
            "The biggest NFT collection launch turned into a gas war disaster when the smart contract had a critical flaw.",
         creator: "0x1234...5678",
         timestamp: Date.now() - 3600000 * 2,
         topics: [
            {
               id: "1",
               type: "link",
               content: "https://twitter.com/web3drama/status/123456789",
               pembuat: "0x1234...5678",
               waktu: Date.now() - 3600000,
            },
            {
               id: "3",
               type: "image",
               content: "/nft-drama.png",
               pembuat: "0x1234...5678",
               waktu: Date.now() - 1800000,
            },
            {
               id: "5",
               type: "link",
               content: "https://etherscan.io/tx/0x123456789abcdef",
               pembuat: "0x8765...4321",
               waktu: Date.now() - 1200000,
            },
            {
               id: "7",
               type: "link",
               content: "https://discord.gg/nftdrama",
               pembuat: "0x1234...5678",
               waktu: Date.now() - 900000,
            },
            {
               id: "9",
               type: "image",
               content: "/nft-drama-2.png",
               pembuat: "0x8765...4321",
               waktu: Date.now() - 600000,
            },
            {
               id: "11",
               type: "link",
               content: "https://medium.com/nft-drama-explained",
               pembuat: "0x1234...5678",
               waktu: Date.now() - 300000,
            },
            {
               id: "36",
               type: "link",
               content: "https://github.com/nft-project/contract-analysis",
               pembuat: "0x8765...4321",
               waktu: Date.now() - 250000,
            },
            {
               id: "37",
               type: "image",
               content: "/nft-drama-3.png",
               pembuat: "0x1234...5678",
               waktu: Date.now() - 200000,
            },
         ],
      },
      {
         id: "2",
         kode: "Rug Pull Season",
         deskripsi:
            "Three major projects disappeared overnight with over $10M in liquidity. Community is in shambles.",
         creator: "0x9876...5432",
         timestamp: Date.now() - 3600000 * 24,
         topics: [
            {
               id: "13",
               type: "link",
               content: "https://rugpulldetective.com/case/123",
               pembuat: "0x9876...5432",
               waktu: Date.now() - 3500000 * 24,
            },
            {
               id: "15",
               type: "image",
               content: "/rug-pull-evidence.png",
               pembuat: "0x9876...5432",
               waktu: Date.now() - 3400000 * 24,
            },
            {
               id: "17",
               type: "link",
               content: "https://twitter.com/rugpullalert/status/987654321",
               pembuat: "0x5555...6666",
               waktu: Date.now() - 3300000 * 24,
            },
            {
               id: "38",
               type: "link",
               content: "https://dune.com/queries/123456/rugpull-analysis",
               pembuat: "0x9876...5432",
               waktu: Date.now() - 3200000 * 24,
            },
            {
               id: "39",
               type: "image",
               content: "/rug-pull-evidence-2.png",
               pembuat: "0x5555...6666",
               waktu: Date.now() - 3100000 * 24,
            },
         ],
      },
      {
         id: "3",
         kode: "Governance Wars",
         deskripsi:
            "DAO members fighting over treasury allocation. Votes being bought by whales to push their agenda.",
         creator: "0x5678...1234",
         timestamp: Date.now() - 3600000 * 48,
         topics: [
            {
               id: "2",
               type: "link",
               content: "https://forum.dao.xyz/proposal/123",
               pembuat: "0x5678...1234",
               waktu: Date.now() - 3600000 * 36,
            },
            {
               id: "4",
               type: "image",
               content: "/dao-governance-battle.png",
               pembuat: "0x5678...1234",
               waktu: Date.now() - 3600000 * 30,
            },
            {
               id: "6",
               type: "link",
               content: "https://snapshot.org/#/dao.eth/proposal/0x987654321",
               pembuat: "0x7777...8888",
               waktu: Date.now() - 3600000 * 24,
            },
            {
               id: "8",
               type: "link",
               content: "https://twitter.com/daowhistleblower/status/567891234",
               pembuat: "0x5678...1234",
               waktu: Date.now() - 3600000 * 18,
            },
            {
               id: "10",
               type: "image",
               content: "/dao-vote-analysis.png",
               pembuat: "0x7777...8888",
               waktu: Date.now() - 3600000 * 12,
            },
            {
               id: "12",
               type: "link",
               content: "https://etherscan.io/tx/0x987654321abcdef",
               pembuat: "0x5678...1234",
               waktu: Date.now() - 3600000 * 6,
            },
            {
               id: "14",
               type: "link",
               content: "https://dune.com/queries/123456/dao-voting-analysis",
               pembuat: "0x7777...8888",
               waktu: Date.now() - 3600000 * 3,
            },
            {
               id: "16",
               type: "image",
               content: "/dao-treasury-chart.png",
               pembuat: "0x5678...1234",
               waktu: Date.now() - 3600000 * 1,
            },
            {
               id: "40",
               type: "link",
               content: "https://medium.com/dao-governance-analysis",
               pembuat: "0x7777...8888",
               waktu: Date.now() - 3600000 * 0.5,
            },
            {
               id: "41",
               type: "image",
               content: "/dao-vote-analysis-2.png",
               pembuat: "0x5678...1234",
               waktu: Date.now() - 3600000 * 0.2,
            },
         ],
      },
   ]);

   useEffect(() => {
      const checkWallet = async () => {
         if (address) {
            const owner = await isContractOwner(address);
            setIsOwner(owner);
         }
      };

      checkWallet();
   }, []);

   const handleConnectWallet = async () => {
      if (address) {
         const owner = await isContractOwner(address);
         setIsOwner(owner);
      }
   };

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
      : [];
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
