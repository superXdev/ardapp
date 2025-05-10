"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Topic } from "@/lib/types";
import { Trash2, Link, ImageIcon, Maximize2 } from "lucide-react";
import Lightbox from "./lightbox";

interface TopicThreadProps {
   topic: Topic;
   dramaId: string;
   walletAddress: string | null;
   onDeleteTopic: (dramaId: string, topicId: string) => void;
}

export default function TopicThread({
   topic,
   dramaId,
   walletAddress,
   onDeleteTopic,
}: TopicThreadProps) {
   const isOwner = walletAddress === topic.pembuat;
   const [lightboxOpen, setLightboxOpen] = useState(false);

   return (
      <>
         <div className="flex items-start gap-2 border-l-2 border-white/20 pl-4 ml-2">
            <div className="flex-1 bg-white/10 rounded-2xl p-3 text-sm">
               <div className="flex items-center gap-1 mb-1 text-xs text-white/60">
                  {topic.type === "link" ? (
                     <Link className="w-3 h-3" />
                  ) : (
                     <ImageIcon className="w-3 h-3" />
                  )}
                  <span>{topic.type === "link" ? "Link" : "Image"}</span>
               </div>

               {topic.type === "link" ? (
                  <a
                     href={topic.content}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-[#f9d423] hover:underline break-all"
                  >
                     {topic.content}
                  </a>
               ) : (
                  <div className="mt-2 relative group">
                     <img
                        src={topic.content || "/placeholder.svg"}
                        alt="Topic image"
                        className="rounded-lg w-full max-h-64 object-cover cursor-pointer transition-all duration-300 group-hover:brightness-90"
                        onClick={() => setLightboxOpen(true)}
                        onError={(e) => {
                           e.currentTarget.src =
                              "/abstract-geometric-shapes.png";
                           e.currentTarget.alt = "Failed to load image";
                        }}
                     />
                     <button
                        onClick={() => setLightboxOpen(true)}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     >
                        <Maximize2 className="w-4 h-4" />
                     </button>
                  </div>
               )}

               <div className="flex justify-between items-center mt-2 text-xs text-white/60">
                  <div>
                     {topic.pembuat.substring(0, 6)}...
                     {topic.pembuat.substring(topic.pembuat.length - 4)}
                  </div>
                  <div>
                     {formatDistanceToNow(new Date(topic.waktu), {
                        addSuffix: true,
                     })}
                  </div>
               </div>
            </div>

            {
               <button
                  onClick={() => onDeleteTopic(dramaId, topic.id)}
                  className="text-[#ff416c] hover:text-[#ff3162] transition-colors p-1"
                  aria-label="Delete topic"
               >
                  <Trash2 className="w-4 h-4" />
               </button>
            }
         </div>

         {topic.type === "image" && (
            <Lightbox
               imageUrl={topic.content}
               isOpen={lightboxOpen}
               onClose={() => setLightboxOpen(false)}
            />
         )}
      </>
   );
}
