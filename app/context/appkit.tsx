"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { base } from "@reown/appkit/networks";

// 1. Get projectId at https://cloud.reown.com
const projectId = "5a00d4e5ba61f7a456456d4d585c8d30";

// 2. Create a metadata object
const metadata = {
   name: "Arda",
   description: "Arsip Drama",
   url: "https://mywebsite.com", // origin must match your domain & subdomain
   icons: ["https://avatars.mywebsite.com/"],
};

// 3. Create the AppKit instance
export const modalWc = createAppKit({
   adapters: [new EthersAdapter()],
   defaultAccountTypes: {
      eip155: "eoa",
   },
   metadata,
   networks: [base],
   defaultNetwork: base,
   chainImages: {
      base: "https://base.org/logo.png",
   },
   projectId,
   features: {
      socials: ["facebook", "google", "github"],
      email: false,
   },
});

export function AppKit({ children }: { children: React.ReactNode }) {
   return <>{children}</>;
}
