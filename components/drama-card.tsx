"use client";

import type React from "react";

import { useState, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Drama } from "@/lib/types";
import { Card } from "@/components/ui/card";
import DramaCardHeader from "./drama-card/header";
import DramaCardContent from "./drama-card/content";
import DramaCardTopics from "./drama-card/topics";
import DramaCardActions from "./drama-card/actions";
import DramaCardReactions from "./drama-card/reactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Plus,
   Trash2,
   Link,
   ImageIcon,
   Upload,
   MessageCircle,
   ChevronDown,
   ChevronUp,
   MessageSquare,
   X,
} from "lucide-react";
import TopicThread from "./topic-thread";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DramaCardProps {
   drama: Drama;
   gradient: string;
   walletAddress: string | null;
   onAddTopic: (
      dramaId: string,
      type: "link" | "image" | "text",
      content: string
   ) => void;
   onDeleteTopic: (dramaId: string, topicId: string) => void;
   onDeleteDrama: (dramaId: string) => void;
   isLoadingTopics?: boolean;
}

export default function DramaCard({
   drama,
   gradient,
   walletAddress,
   onAddTopic,
   onDeleteTopic,
   onDeleteDrama,
   isLoadingTopics = false,
}: DramaCardProps) {
   const [linkContent, setLinkContent] = useState("");
   const [textContent, setTextContent] = useState("");
   const [topicType, setTopicType] = useState<"link" | "image" | "text">(
      "link"
   );
   const [imagePreview, setImagePreview] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [isTopicsExpanded, setIsTopicsExpanded] = useState(true);
   const [topicsToShow, setTopicsToShow] = useState(3);
   const [isSubmittingTopic, setIsSubmittingTopic] = useState(false);
   const [isUploadingImage, setIsUploadingImage] = useState(false);
   const [uploadStatus, setUploadStatus] = useState<
      "idle" | "uploading" | "success" | "error"
   >("idle");

   const handleAddTopic = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
         setIsSubmittingTopic(true);

         if (topicType === "link" && linkContent.trim()) {
            // Process link content before sending to ensure it has proper format
            let processedLink = linkContent.trim();

            // Make sure link has proper format
            if (
               !processedLink.startsWith("http://") &&
               !processedLink.startsWith("https://")
            ) {
               processedLink = `https://${processedLink}`;
            }

            await onAddTopic(drama.id, "link", processedLink);
            setLinkContent("");
         } else if (topicType === "image" && imagePreview) {
            await onAddTopic(drama.id, "image", imagePreview);
            setImagePreview(null);
            setUploadStatus("idle");
            if (fileInputRef.current) {
               fileInputRef.current.value = "";
            }
         } else if (topicType === "text" && textContent.trim()) {
            await onAddTopic(drama.id, "text", textContent.trim());
            setTextContent("");
         }
      } catch (error) {
         console.error("Error adding topic:", error);
      } finally {
         setIsSubmittingTopic(false);
      }
   };

   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         // Show loading state
         setIsUploadingImage(true);
         setUploadStatus("uploading");

         try {
            // Create a preview for immediate feedback
            const reader = new FileReader();
            reader.onloadend = () => {
               // Just for preview, not for submission
               setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to IPFS via our API route
            const formData = new FormData();
            formData.append("file", file);

            console.log("Uploading image to IPFS...");
            const response = await fetch("/api/upload", {
               method: "POST",
               body: formData,
            });

            if (!response.ok) {
               const errorData = await response.json();
               throw new Error(errorData.error || "Upload failed");
            }

            const data = await response.json();
            console.log("IPFS upload successful:", data);

            // Store the IPFS hash instead of the full image data
            // We only submit this to the blockchain when the user clicks add topic
            setImagePreview(data.ipfsHash);
            setUploadStatus("success");
         } catch (error) {
            console.error("Error uploading to IPFS:", error);
            setUploadStatus("error");
         } finally {
            setIsUploadingImage(false);
         }
      }
   };

   const handleDeleteDrama = () => {
      onDeleteDrama(drama.id);
   };

   const hasMoreTopics = drama.topics.length > topicsToShow;
   const visibleTopics = isTopicsExpanded
      ? drama.topics.slice(0, topicsToShow)
      : [];

   const handleShowMoreTopics = () => {
      setTopicsToShow((prev) => prev + 5);
   };

   const handleShowLessTopics = () => {
      setTopicsToShow(3);
   };

   return (
      <Card
         className={`overflow-hidden transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${gradient} text-white border border-white/10 shadow-lg relative`}
      >
         <DramaCardHeader kode={drama.kode} timestamp={drama.timestamp} />

         <DramaCardContent
            deskripsi={drama.deskripsi}
            creator={drama.creator}
         />

         <DramaCardReactions dramaId={drama.id} />

         <div className="pt-4 border-t border-white/10 px-6">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">
                     Topic Threads
                  </h4>
                  <span className="bg-[#6a11cb]/40 text-white text-xs px-2 py-0.5 rounded-full">
                     {drama.topics.length}
                  </span>
               </div>
               <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => setIsTopicsExpanded(!isTopicsExpanded)}
               >
                  {isTopicsExpanded ? "Collapse" : "Expand"}
               </Button>
            </div>

            {walletAddress && isTopicsExpanded && (
               <form onSubmit={handleAddTopic} className="mb-4">
                  <Tabs
                     defaultValue="link"
                     className="w-full"
                     onValueChange={(value) => {
                        setTopicType(value as "link" | "image" | "text");
                        setImagePreview(null);
                        if (fileInputRef.current) {
                           fileInputRef.current.value = "";
                        }
                     }}
                  >
                     <TabsList className="bg-white/10 border border-white/20 p-1">
                        <TabsTrigger
                           value="link"
                           className="text-sm font-medium text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6a11cb] data-[state=active]:to-[#f9d423]"
                        >
                           <Link className="w-4 h-4 mr-1" /> Link
                        </TabsTrigger>
                        <TabsTrigger
                           value="image"
                           className="text-sm font-medium text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6a11cb] data-[state=active]:to-[#f9d423]"
                        >
                           <ImageIcon className="w-4 h-4 mr-1" /> Image
                        </TabsTrigger>
                        <TabsTrigger
                           value="text"
                           className="text-sm font-medium text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6a11cb] data-[state=active]:to-[#f9d423]"
                        >
                           <MessageSquare className="w-4 h-4 mr-1" /> Text
                        </TabsTrigger>
                     </TabsList>
                     <TabsContent value="link" className="mt-0">
                        <div className="flex gap-2">
                           <Input
                              value={linkContent}
                              onChange={(e) => setLinkContent(e.target.value)}
                              placeholder="Enter link URL..."
                              className="bg-white/10 border-white/10 placeholder:text-white/30 text-white"
                           />
                           <Button
                              type="submit"
                              size="sm"
                              disabled={
                                 !linkContent.trim() || isSubmittingTopic
                              }
                              className="bg-gradient-to-r from-[#6a11cb] to-[#f9d423] hover:from-[#5a0cb6] hover:to-[#e9c413] text-white disabled:opacity-50"
                           >
                              {isSubmittingTopic ? (
                                 <span className="flex items-center">
                                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Adding...
                                 </span>
                              ) : (
                                 <>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add
                                 </>
                              )}
                           </Button>
                        </div>
                     </TabsContent>
                     <TabsContent value="image" className="mt-0">
                        <div className="space-y-3">
                           <div className="flex gap-2">
                              <div className="relative flex-1">
                                 <Button
                                    type="button"
                                    className={`w-full ${
                                       isUploadingImage
                                          ? "bg-white/20"
                                          : "bg-white/10 hover:bg-white/20"
                                    } border border-dashed border-white/30 text-white h-10 px-3 py-2 flex items-center justify-center`}
                                    onClick={() =>
                                       fileInputRef.current?.click()
                                    }
                                    disabled={isUploadingImage}
                                 >
                                    {isUploadingImage ? (
                                       <span className="flex items-center">
                                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                          Uploading to IPFS...
                                       </span>
                                    ) : (
                                       <>
                                          <Upload className="w-4 h-4 mr-2" />
                                          {imagePreview
                                             ? "Change Image"
                                             : "Choose Image File"}
                                       </>
                                    )}
                                 </Button>
                                 <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={isUploadingImage}
                                 />
                              </div>
                              <Button
                                 type="submit"
                                 size="sm"
                                 disabled={
                                    !imagePreview ||
                                    isSubmittingTopic ||
                                    isUploadingImage
                                 }
                                 className="bg-gradient-to-r from-[#6a11cb] to-[#f9d423] hover:from-[#5a0cb6] hover:to-[#e9c413] text-white disabled:opacity-50"
                              >
                                 {isSubmittingTopic ? (
                                    <span className="flex items-center">
                                       <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                       Adding...
                                    </span>
                                 ) : (
                                    <>
                                       <Plus className="w-4 h-4 mr-1" />
                                       Add
                                    </>
                                 )}
                              </Button>
                           </div>
                           {imagePreview && (
                              <div className="mt-2 relative">
                                 <img
                                    src={
                                       imagePreview.startsWith("Qm") ||
                                       imagePreview.startsWith("baf")
                                          ? `https://gateway.pinata.cloud/ipfs/${imagePreview}`
                                          : imagePreview
                                    }
                                    alt="Preview"
                                    className="rounded-lg max-h-32 object-cover border border-white/20"
                                    onError={(e) => {
                                       e.currentTarget.src =
                                          "/abstract-geometric-shapes.png";
                                    }}
                                 />
                                 {uploadStatus === "success" && (
                                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded-md text-xs">
                                       Uploaded to IPFS ✓
                                    </div>
                                 )}
                                 <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-red-500/80"
                                    onClick={() => {
                                       setImagePreview(null);
                                       setUploadStatus("idle");
                                       if (fileInputRef.current) {
                                          fileInputRef.current.value = "";
                                       }
                                    }}
                                 >
                                    <Trash2 className="h-3 w-3" />
                                 </Button>
                              </div>
                           )}
                        </div>
                     </TabsContent>
                     <TabsContent value="text" className="mt-0">
                        <div className="space-y-3">
                           <div className="flex gap-2">
                              <div className="relative flex-1">
                                 <textarea
                                    value={textContent}
                                    onChange={(e) =>
                                       setTextContent(e.target.value)
                                    }
                                    placeholder="Write your text here..."
                                    className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/30 text-white h-20 px-3 py-2 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-[#6a11cb]"
                                 />
                              </div>
                           </div>
                           <div className="flex justify-end">
                              <Button
                                 type="submit"
                                 size="sm"
                                 disabled={
                                    !textContent.trim() || isSubmittingTopic
                                 }
                                 className="bg-gradient-to-r from-[#6a11cb] to-[#f9d423] hover:from-[#5a0cb6] hover:to-[#e9c413] text-white disabled:opacity-50"
                              >
                                 {isSubmittingTopic ? (
                                    <span className="flex items-center">
                                       <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                       Adding...
                                    </span>
                                 ) : (
                                    <>
                                       <Plus className="w-4 h-4 mr-1" />
                                       Add
                                    </>
                                 )}
                              </Button>
                           </div>
                        </div>
                     </TabsContent>
                  </Tabs>
               </form>
            )}

            <DramaCardTopics
               dramaId={drama.id}
               topics={drama.topics}
               walletAddress={walletAddress}
               topicsToShow={topicsToShow}
               isTopicsExpanded={isTopicsExpanded}
               onDeleteTopic={onDeleteTopic}
               onShowMore={handleShowMoreTopics}
               onShowLess={handleShowLessTopics}
               isLoading={isLoadingTopics}
            />
         </div>
         <DramaCardActions
            dramaId={drama.id}
            onDeleted={handleDeleteDrama}
            drama={drama}
         />
      </Card>
   );
}
