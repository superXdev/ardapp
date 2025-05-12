import { ethers } from "ethers";
import { Drama } from "./types";

const SC_ADDRESS = "0xB888Ad072039A4e398BDE841055Fa8BcDd7CC324";
const INFURA_URL =
   "https://base-mainnet.infura.io/v3/174e4c41c7ad40f18fa0d6f39539ffb4";

export async function newDrama(
   kode: string,
   deskripsi: string,
   signer: any
): Promise<boolean> {
   try {
      const contract = new ethers.Contract(
         SC_ADDRESS,
         require("@/app/context/abi.json"),
         signer
      );

      await contract.tambahDramaBaru(kode, deskripsi);

      return true;
   } catch (error) {
      console.error("Error adding drama:", error);
      return false;
   }
}

export async function getDrama(): Promise<Drama[]> {
   try {
      const provider = new ethers.JsonRpcProvider(INFURA_URL);
      const contract = new ethers.Contract(
         SC_ADDRESS,
         require("@/app/context/abi.json"),
         provider
      );

      const lastId = await contract.lastId();

      let result: Drama[] = [];
      for (let i = 1; i <= lastId; i++) {
         const drama = await contract.drama(i);
         if (drama[2] === ethers.ZeroAddress) continue;

         // Fetch topics for this drama
         const topics = [];
         let continueFetching = true;
         let topicIndex = 0;
         let maxTolerance = 5;
         while (continueFetching) {
            try {
               const topic = await contract.topics(i, topicIndex);
               if (!topic || topic.pembuat === ethers.ZeroAddress) {
                  topicIndex++;
                  continue;
               }

               // Determine topic type based on content and metadata
               let topicType: "link" | "image" | "text";
               const content = topic.link;

               if (
                  content.startsWith("http://") ||
                  content.startsWith("https://")
               ) {
                  // It's a standard URL - check if it's an image URL
                  const imageExtRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
                  topicType = imageExtRegex.test(content) ? "image" : "link";
               } else if (content.includes(".") && !content.includes(" ")) {
                  // If it has a dot but no spaces, it's likely a domain/URL
                  topicType = "link";
               } else if (content.includes("Qm") || content.includes("baf")) {
                  // If it starts with Qm or baf, it's an IPFS hash
                  topicType = "image";
               } else {
                  // Default to text for anything else
                  topicType = "text";
               }

               // Process content based on detected type
               let processedContent = topic.link;

               // Remove any special prefixes we may have added
               if (processedContent.startsWith("__LINK__:")) {
                  processedContent = processedContent.substring(9);
               } else if (processedContent.startsWith("__TEXT__:")) {
                  processedContent = processedContent.substring(9);
               }

               topics.push({
                  id: topicIndex.toString(),
                  type: topicType,
                  content: processedContent,
                  pembuat: topic.pembuat,
                  waktu: Number(topic.waktu.toString()) * 1000,
               });
               topicIndex++;
            } catch (error) {
               continueFetching = false;
            }
         }

         result.push({
            id: i.toString(),
            kode: drama[0].toString(),
            deskripsi: drama[1].toString(),
            creator: drama[2].toString(),
            timestamp: Number(drama[3].toString()) * 1000,
            topics: topics,
         });
      }
      return result;
   } catch (error) {
      console.error("Error fetching drama:", error);
      return [];
   }
}

export async function getCurrentWalletAddress(): Promise<string | null> {
   // In a real app, check if user is already connected
   return null;
}

export async function isContractOwner(address: string): Promise<boolean> {
   // Simulate contract owner check
   // In a real app, you would call a contract method
   return Math.random() > 0.7; // 30% chance of being the owner
}

export async function tambahDramaBaru(
   kode: string,
   deskripsi: string
): Promise<boolean> {
   // Simulate contract interaction
   console.log("Adding new drama:", { kode, deskripsi });
   return true;
}

export async function tambahTopikDrama(
   dramaId: string,
   link: string,
   signer: any
): Promise<boolean> {
   try {
      const contract = new ethers.Contract(
         SC_ADDRESS,
         require("@/app/context/abi.json"),
         signer
      );

      const tx = await contract.tambahTopikDrama(link, dramaId);
      await tx.wait();

      return true;
   } catch (error) {
      console.error("Error adding topic to drama:", error);
      return false;
   }
}

export async function hapusDrama(
   dramaId: string,
   signer: any
): Promise<boolean> {
   try {
      const contract = new ethers.Contract(
         SC_ADDRESS,
         require("@/app/context/abi.json"),
         signer
      );
      await contract.hapusDrama(dramaId);
      return true;
   } catch (error) {
      console.error("Error deleting drama:", error);
      return false;
   }
}

export async function hapusTopikDrama(
   dramaId: string,
   topicId: string,
   signer: any
): Promise<boolean> {
   try {
      const contract = new ethers.Contract(
         SC_ADDRESS,
         require("@/app/context/abi.json"),
         signer
      );

      const tx = await contract.hapusTopikDrama(dramaId, topicId);
      await tx.wait();

      return true;
   } catch (error) {
      console.error("Error deleting topic from drama:", error);
      return false;
   }
}

export async function destroyContract(): Promise<boolean> {
   // Simulate contract destruction
   console.log("Destroying contract");
   return true;
}
