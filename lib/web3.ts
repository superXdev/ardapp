import { ethers } from "ethers";

const SC_ADDRESS = "0xB888Ad072039A4e398BDE841055Fa8BcDd7CC324";

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
