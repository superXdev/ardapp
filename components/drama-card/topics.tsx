import React, { useState } from "react";
import TopicThread from "../topic-thread";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MessageCircle, Clock, ArrowUpDown } from "lucide-react";
import type { Drama, Topic } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

interface DramaCardTopicsProps {
   dramaId: string;
   topics: Topic[];
   walletAddress: string | null;
   topicsToShow: number;
   isTopicsExpanded: boolean;
   onDeleteTopic: (dramaId: string, topicId: string) => void;
   onShowMore: () => void;
   onShowLess: () => void;
   isLoading?: boolean;
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
   isLoading = false,
}: DramaCardTopicsProps) {
   const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
   
   // Sort topics based on the selected sort order
   const sortedTopics = [...topics].sort((a, b) => {
      if (sortOrder === "newest") {
         return b.waktu - a.waktu;
      } else {
         return a.waktu - b.waktu;
      }
   });
   
   const hasMoreTopics = sortedTopics.length > topicsToShow;
   const visibleTopics = isTopicsExpanded ? sortedTopics.slice(0, topicsToShow) : [];
   return (
      <div className="pb-4">
         {isTopicsExpanded && (
            <div className="space-y-4">
               {isLoading ? (
                  // Loading skeleton UI
                  <div className="space-y-3">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                           <Skeleton className="h-12 bg-white/10 rounded-md mb-2" />
                           <Skeleton className="h-4 w-3/4 bg-white/10 rounded-md" />
                        </div>
                     ))}
                  </div>
               ) : topics.length === 0 ? (
                  <p className="text-sm text-white/70">No topics yet</p>
               ) : (
                  <>
                     {/* Sort control */}
                     <div className="flex justify-end mb-2">
                        <Select
                           value={sortOrder}
                           onValueChange={(value) => 
                              setSortOrder(value as "newest" | "oldest")
                           }
                        >
                           <SelectTrigger className="w-[180px] h-8 bg-white/10 text-white text-xs border-white/20">
                              <SelectValue placeholder="Sort by" />
                           </SelectTrigger>
                           <SelectContent className="bg-[#1a1a1a] border-white/20 text-white">
                              <SelectItem value="newest">
                                 <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>Newest first</span>
                                 </div>
                              </SelectItem>
                              <SelectItem value="oldest">
                                 <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>Oldest first</span>
                                 </div>
                              </SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-4">
                        {visibleTopics.length > 0 ? (
                           visibleTopics.map((topic) => (
                              <TopicThread
                                 key={topic.id}
                                 topic={topic}
                                 dramaId={dramaId}
                                 walletAddress={walletAddress}
                                 onDeleteTopic={onDeleteTopic}
                              />
                           ))
                        ) : (
                           <p className="text-sm text-white/70 italic">No topics match the current filter</p>
                        )}
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
