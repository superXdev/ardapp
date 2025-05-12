import React from "react";
import TopicThread from "../topic-thread";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import type { Drama, Topic } from "@/lib/types";

interface DramaCardTopicsProps {
   dramaId: string;
   topics: Topic[];
   walletAddress: string | null;
   topicsToShow: number;
   isTopicsExpanded: boolean;
   onDeleteTopic: (dramaId: string, topicId: string) => void;
   onShowMore: () => void;
   onShowLess: () => void;
}

export default function DramaCardTopics({
   dramaId,
   topics,
   walletAddress,
   topicsToShow,
   isTopicsExpanded,
   onDeleteTopic,
   onShowMore,
   onShowLess,
}: DramaCardTopicsProps) {
   const hasMoreTopics = topics.length > topicsToShow;
   const visibleTopics = isTopicsExpanded ? topics.slice(0, topicsToShow) : [];
   return (
      <div className="pb-4">
         {isTopicsExpanded && (
            <div className="space-y-4">
               {topics.length === 0 ? (
                  <p className="text-sm text-white/70">No topics yet</p>
               ) : (
                  <>
                     <div className="space-y-4">
                        {visibleTopics.map((topic) => (
                           <TopicThread
                              key={topic.id}
                              topic={topic}
                              dramaId={dramaId}
                              walletAddress={walletAddress}
                              onDeleteTopic={onDeleteTopic}
                           />
                        ))}
                     </div>
                     {topics.length > 0 && (
                        <div className="flex justify-center pt-2">
                           {hasMoreTopics && (
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={onShowMore}
                                 className="text-white/70 hover:text-white hover:bg-white/10"
                              >
                                 <ChevronDown className="w-4 h-4 mr-1" />
                                 Show More ({topics.length - topicsToShow} more)
                              </Button>
                           )}
                           {topicsToShow > 3 && !hasMoreTopics && (
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={onShowLess}
                                 className="text-white/70 hover:text-white hover:bg-white/10"
                              >
                                 <ChevronUp className="w-4 h-4 mr-1" />
                                 Show Less
                              </Button>
                           )}
                        </div>
                     )}
                  </>
               )}
            </div>
         )}
         {!isTopicsExpanded && topics.length > 0 && (
            <div className="flex items-center gap-2 text-white/70 text-sm py-2">
               <MessageCircle className="w-4 h-4" />
               <span>{topics.length} topics - click Expand to view</span>
            </div>
         )}
      </div>
   );
}
