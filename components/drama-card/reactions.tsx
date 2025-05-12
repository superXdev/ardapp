import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";

const reactions = [
   { emoji: "👍", label: "Like" },
   { emoji: "❤️", label: "Love" },
   { emoji: "😂", label: "Haha" },
   { emoji: "😮", label: "Wow" },
   { emoji: "😢", label: "Sad" },
];

interface DramaCardReactionsProps {
   dramaId: string;
}

export default function DramaCardReactions({
   dramaId,
}: DramaCardReactionsProps) {
   const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(
      reactions.reduce((acc, { emoji }) => ({ ...acc, [emoji]: 0 }), {})
   );

   const handleReaction = (emoji: string) => {
      setReactionCounts((prev) => ({
         ...prev,
         [emoji]: prev[emoji] + 1,
      }));
   };

   return (
      <div className="flex items-center gap-1 px-6 py-3 border-t border-white/10">
         {reactions.map(({ emoji, label }) => (
            <TooltipProvider key={emoji}>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReaction(emoji)}
                        className="h-8 px-2 hover:bg-white/10 text-white/90 hover:text-white flex items-center gap-1"
                     >
                        <span className="text-base">{emoji}</span>
                        {reactionCounts[emoji] > 0 && (
                           <span className="text-xs font-medium">
                              {reactionCounts[emoji]}
                           </span>
                        )}
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p className="text-sm">{label}</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         ))}
      </div>
   );
}
