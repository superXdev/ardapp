import React from "react";
import { CardContent } from "@/components/ui/card";

interface DramaCardContentProps {
  deskripsi: string;
  creator: string;
}

export default function DramaCardContent({ deskripsi, creator }: DramaCardContentProps) {
  return (
    <CardContent className="space-y-4">
      <p className="text-lg text-white/90">{deskripsi}</p>
      <div className="flex items-center gap-2 text-sm text-white/70">
        <div className="w-6 h-6 rounded-full bg-[#6a11cb]/30 flex items-center justify-center text-xs">0x</div>
        <a
          href={`https://basescan.org/address/${creator}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          {creator.slice(0, 6)}...{creator.slice(-4)}
        </a>
      </div>
    </CardContent>
  );
}
