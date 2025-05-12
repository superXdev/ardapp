import React from "react";
import { CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface DramaCardHeaderProps {
  kode: string;
  timestamp: string | number | Date;
}

export default function DramaCardHeader({ kode, timestamp }: DramaCardHeaderProps) {
  return (
    <CardHeader className="pb-2 bg-black/10">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="bg-[#6a11cb]/30 rounded-full p-2 animate-pulse">🔥</div>
          <h3 className="text-xl font-bold text-white">{kode}</h3>
        </div>
        <div className="text-sm text-white/70">
          {(() => {
            try {
              // Ensure timestamp is a valid date
              const date = new Date(timestamp);
              // Check if date is valid before formatting
              if (isNaN(date.getTime())) {
                return 'Unknown date';
              }
              return formatDistanceToNow(date, { addSuffix: true });
            } catch (error) {
              console.error('Error formatting date:', error);
              return 'Unknown date';
            }
          })()}
        </div>
      </div>
    </CardHeader>
  );
}
