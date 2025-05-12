"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Topic } from "@/lib/types";
import {
   Trash2,
   Link,
   ImageIcon,
   Maximize2,
   MessageSquare,
} from "lucide-react";
import Lightbox from "./lightbox";

interface TopicThreadProps {
   topic: Topic;
   dramaId: string;
   walletAddress: string | null;
   onDeleteTopic: (dramaId: string, topicId: string) => void;
}

// Helper function to detect content type
const detectContentType = (
   content: string
): { type: "link" | "image" | "text"; content: string } => {
   // Check if it's an IPFS hash (typical format: Qm... or bafy...)
   const ipfsHashRegex = /^(Qm[1-9A-Za-z]{44}|bafy[a-zA-Z0-9]{55})$/;
   if (ipfsHashRegex.test(content.trim())) {
      // Prefix with IPFS gateway URL - use Pinata's gateway
      return {
         type: "image",
         content: `https://gateway.pinata.cloud/ipfs/${content.trim()}`,
      };
   }

   // Check if it's a URL
   const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
   if (
      urlRegex.test(content) ||
      content.startsWith("http://") ||
      content.startsWith("https://")
   ) {
      return { type: "link", content };
   }

   // Check if it's a data URL for an image
   if (content.startsWith("data:image")) {
      return { type: "image", content };
   }

   // Default to text
   return { type: "text", content };
};

export default function TopicThread({
   topic,
   dramaId,
   walletAddress,
   onDeleteTopic,
}: TopicThreadProps) {
   // Check if user is owner - make case-insensitive comparison
   // Also show delete button in development mode for testing
   const isOwner = walletAddress && 
      (walletAddress.toLowerCase() === topic.pembuat.toLowerCase() || 
       process.env.NODE_ENV === 'development');
   const [lightboxOpen, setLightboxOpen] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   // Process content based on its type for better display
   let processedContent = topic.content;

   // Process content for rendering based on type

   // Ensure proper content processing based on explicit type
   if (topic.type === "image") {
      // Check if it's a raw IPFS hash (no protocol)
      const ipfsHashRegex = /^(Qm[1-9A-Za-z]{44}|bafy[a-zA-Z0-9]{55})$/;
      if (ipfsHashRegex.test(processedContent.trim())) {
         // Use Pinata gateway for better reliability
         processedContent = `https://gateway.pinata.cloud/ipfs/${processedContent.trim()}`;
      } else if (processedContent.startsWith("ipfs://")) {
         // Convert ipfs:// protocol to https with Pinata gateway
         processedContent = processedContent.replace(
            "ipfs://",
            "https://gateway.pinata.cloud/ipfs/"
         );
      } else if (processedContent.includes("/ipfs/")) {
         // If it's already a gateway URL but not Pinata, keep it as is
         // No changes needed as it's already a valid URL
      } else if (!processedContent.startsWith("http")) {
         // For any other non-URL format, assume it might be a hash and try Pinata gateway
         processedContent = `https://gateway.pinata.cloud/ipfs/${processedContent}`;
      }

      console.log("Processed image content:", processedContent);
   } else if (topic.type === "link") {
      // Ensure links have proper protocol
      if (
         !processedContent.startsWith("http://") &&
         !processedContent.startsWith("https://")
      ) {
         processedContent = `https://${processedContent}`;
      }

      // Make sure the link is properly formed
      try {
         new URL(processedContent);
      } catch (e) {
         // If this fails, it's not a valid URL, try to fix it
         console.log("Invalid URL:", processedContent);
         processedContent = `https://${processedContent.replace(
            /^https?:\/\//,
            ""
         )}`;
      }
   }

   // Use the original type for rendering
   const detectedType = topic.type;

   return (
      <>
         <div className="flex items-start gap-2 border-l-2 border-white/20 pl-4 ml-2">
            <div className="flex-1 bg-white/10 rounded-2xl p-3 text-sm">
               <div className="flex items-center gap-1 mb-1 text-xs text-white/60">
                  {detectedType === "link" ? (
                     <Link className="w-3 h-3" />
                  ) : detectedType === "image" ? (
                     <ImageIcon className="w-3 h-3" />
                  ) : (
                     <MessageSquare className="w-3 h-3" />
                  )}
                  <span>
                     {detectedType === "link"
                        ? "Link"
                        : detectedType === "image"
                        ? "Image"
                        : "Text"}
                  </span>
               </div>

               {detectedType === "link" ? (
                  <a
                     href={processedContent}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-[#f9d423] hover:underline break-all"
                     onClick={(e) => {
                        // Double-check the URL is properly formed
                        if (!processedContent.startsWith("http")) {
                           e.preventDefault();
                           window.open(`https://${processedContent}`, "_blank");
                        }
                     }}
                  >
                     {processedContent}
                  </a>
               ) : detectedType === "image" ? (
                  <div className="mt-2 relative group">
                     <img
                        src={processedContent || "/placeholder.svg"}
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
               ) : (
                  <p className="text-white whitespace-pre-wrap break-words">
                     {processedContent}
                  </p>
               )}

               <div className="flex justify-between items-center mt-2 text-xs text-white/60">
                  <div>
                     <a
                        href={`https://basescan.org/address/${topic.pembuat}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-white"
                     >
                        {topic.pembuat.substring(0, 6)}...
                        {topic.pembuat.substring(topic.pembuat.length - 4)}
                     </a>
                  </div>
                  <div>
                     {formatDistanceToNow(new Date(topic.waktu), {
                        addSuffix: true,
                     })}
                  </div>
               </div>
            </div>

            {/* Always show delete button for now to debug */}
            {true && (
               <button
                  onClick={async () => {
                     if (window.confirm('Are you sure you want to delete this topic?')) {
                        setIsDeleting(true);
                        try {
                           await onDeleteTopic(dramaId, topic.id);
                        } catch (error) {
                           console.error('Error deleting topic:', error);
                           alert('Failed to delete topic. Please try again.');
                        } finally {
                           setIsDeleting(false);
                        }
                     }
                  }}
                  className="text-[#ff416c] hover:text-[#ff3162] transition-colors p-1 disabled:opacity-50"
                  disabled={isDeleting}
                  aria-label="Delete topic"
               >
                  {isDeleting ? (
                     <span className="animate-pulse">...</span>
                  ) : (
                     <Trash2 className="w-4 h-4" />
                  )}
               </button>
            )}
         </div>

         {detectedType === "image" && lightboxOpen && (
            <Lightbox
               imageUrl={processedContent}
               isOpen={lightboxOpen}
               onClose={() => setLightboxOpen(false)}
            />
         )}
      </>
   );
}
