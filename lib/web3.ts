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
         result.push({
            id: i.toString(),
            kode: drama[0].toString(),
            deskripsi: drama[1].toString(),
            creator: drama[2].toString(),
            timestamp: Number(drama[3].toString()) * 1000,
            topics: [],
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
   link: string
): Promise<boolean> {
   // Simulate contract interaction
   console.log("Adding topic to drama:", { dramaId, link });
   return true;
}

export async function hapusTopikDrama(
   dramaId: string,
   topicId: string
): Promise<boolean> {
   // Simulate contract interaction
   console.log("Deleting topic from drama:", { dramaId, topicId });
   return true;
}

export async function destroyContract(): Promise<boolean> {
   // Simulate contract destruction
   console.log("Destroying contract");
   return true;
}
