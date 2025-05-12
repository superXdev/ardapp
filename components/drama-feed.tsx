import type { Drama } from "@/lib/types";
import DramaCard from "./drama-card/index";

interface DramaFeedProps {
   dramas: Drama[] | null;
   walletAddress: string | null;
   onAddTopic: (
      dramaId: string,
      type: "link" | "image",
      content: string
   ) => void;
   onDeleteTopic: (dramaId: string, topicId: string) => void;
   onDeleteDrama: (dramaId: string) => void;
}

export default function DramaFeed({
   dramas,
   walletAddress,
   onAddTopic,
   onDeleteTopic,
   onDeleteDrama,
}: DramaFeedProps) {
   const gradients = [
      "from-card-1-from to-card-1-to",
      "from-card-2-from to-card-2-to",
      "from-card-3-from to-card-3-to",
   ];

   return (
      <section className="space-y-6">
         <h2 className="text-2xl font-bold mb-4">Drama Feed</h2>

         {dramas === null ? (
            <div className="flex flex-col items-center justify-center py-16">
               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#6a11cb] mb-4"></div>
               <span className="text-white/70 text-lg">Loading drama...</span>
            </div>
         ) : dramas.length === 0 ? (
            <div className="text-center py-10 text-white/60">
               No dramas yet. Be the first to post!
            </div>
         ) : (
            dramas.map((drama, index) => (
               <DramaCard
                  key={drama.id}
                  drama={drama}
                  gradient={gradients[index % gradients.length]}
                  walletAddress={walletAddress}
                  onAddTopic={onAddTopic}
                  onDeleteTopic={onDeleteTopic}
                  onDeleteDrama={onDeleteDrama}
               />
            ))
         )}
      </section>
   );
}
