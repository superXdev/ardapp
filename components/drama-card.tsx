"use client"

import type React from "react"

import { useState, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import type { Drama } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Link, ImageIcon, Upload, MessageCircle, ChevronDown, ChevronUp } from "lucide-react"
import TopicThread from "./topic-thread"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DramaCardProps {
  drama: Drama
  gradient: string
  walletAddress: string | null
  onAddTopic: (dramaId: string, type: "link" | "image", content: string) => void
  onDeleteTopic: (dramaId: string, topicId: string) => void
  onDeleteDrama: (dramaId: string) => void
}

export default function DramaCard({
  drama,
  gradient,
  walletAddress,
  onAddTopic,
  onDeleteTopic,
  onDeleteDrama,
}: DramaCardProps) {
  const [linkContent, setLinkContent] = useState("")
  const [topicType, setTopicType] = useState<"link" | "image">("link")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isTopicsExpanded, setIsTopicsExpanded] = useState(true)
  const [topicsToShow, setTopicsToShow] = useState(3)

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault()
    if (topicType === "link" && linkContent.trim()) {
      onAddTopic(drama.id, "link", linkContent)
      setLinkContent("")
    } else if (topicType === "image" && imagePreview) {
      onAddTopic(drama.id, "image", imagePreview)
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteDrama = () => {
    if (confirm("Are you sure you want to delete this drama?")) {
      onDeleteDrama(drama.id)
    }
  }

  const getEmojiBadge = (kode: string) => {
    if (kode.toLowerCase().includes("rug")) return "💀"
    if (kode.toLowerCase().includes("war")) return "⚔️"
    if (kode.toLowerCase().includes("governance")) return "🏛️"
    if (kode.toLowerCase().includes("hack")) return "🔓"
    return "🔥"
  }

  const isCreator = walletAddress === drama.creator
  const hasMoreTopics = drama.topics.length > topicsToShow
  const visibleTopics = isTopicsExpanded ? drama.topics.slice(0, topicsToShow) : []

  const handleShowMoreTopics = () => {
    setTopicsToShow((prev) => prev + 5)
  }

  const handleShowLessTopics = () => {
    setTopicsToShow(3)
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${gradient} text-white border border-white/10 shadow-lg relative`}
    >
      <CardHeader className="pb-2 bg-black/10">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-[#6a11cb]/30 rounded-full p-2 animate-pulse">{getEmojiBadge(drama.kode)}</div>
            <h3 className="text-xl font-bold text-white">{drama.kode}</h3>
          </div>
          <div className="text-sm text-white/70">
            {formatDistanceToNow(new Date(drama.timestamp), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-lg text-white/90">{drama.deskripsi}</p>

        <div className="flex items-center gap-2 text-sm text-white/70">
          <div className="w-6 h-6 rounded-full bg-[#6a11cb]/30 flex items-center justify-center text-xs">
            {drama.creator.substring(0, 2)}
          </div>
          {drama.creator.substring(0, 6)}...{drama.creator.substring(drama.creator.length - 4)}
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">Topic Threads</h4>
              <span className="bg-[#6a11cb]/40 text-white text-xs px-2 py-0.5 rounded-full">{drama.topics.length}</span>
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
                  setTopicType(value as "link" | "image")
                  setImagePreview(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
              >
                <TabsList className="grid grid-cols-2 mb-2 bg-black/20">
                  <TabsTrigger value="link" className="data-[state=active]:bg-[#6a11cb]/40">
                    <Link className="w-4 h-4 mr-2" />
                    Link
                  </TabsTrigger>
                  <TabsTrigger value="image" className="data-[state=active]:bg-[#6a11cb]/40">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
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
                      className="bg-gradient-to-r from-[#6a11cb] to-[#f9d423] hover:from-[#5a0cb6] hover:to-[#e9c413] text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="image" className="mt-0">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Button
                          type="button"
                          className="w-full bg-white/10 hover:bg-white/20 border border-dashed border-white/30 text-white h-10 px-3 py-2 flex items-center justify-center"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {imagePreview ? "Change Image" : "Choose Image File"}
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!imagePreview}
                        className="bg-gradient-to-r from-[#6a11cb] to-[#f9d423] hover:from-[#5a0cb6] hover:to-[#e9c413] text-white disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    {imagePreview && (
                      <div className="mt-2 relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="rounded-lg max-h-32 object-cover border border-white/20"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-red-500/80"
                          onClick={() => {
                            setImagePreview(null)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ""
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          )}

          {isTopicsExpanded && (
            <div className="space-y-4">
              {drama.topics.length === 0 ? (
                <p className="text-sm text-white/70">No topics yet</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {visibleTopics.map((topic) => (
                      <TopicThread
                        key={topic.id}
                        topic={topic}
                        dramaId={drama.id}
                        walletAddress={walletAddress}
                        onDeleteTopic={onDeleteTopic}
                      />
                    ))}
                  </div>

                  {drama.topics.length > 0 && (
                    <div className="flex justify-center pt-2">
                      {hasMoreTopics && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleShowMoreTopics}
                          className="text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show More ({drama.topics.length - topicsToShow} more)
                        </Button>
                      )}

                      {topicsToShow > 3 && !hasMoreTopics && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleShowLessTopics}
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

          {!isTopicsExpanded && drama.topics.length > 0 && (
            <div className="flex items-center gap-2 text-white/70 text-sm py-2">
              <MessageCircle className="w-4 h-4" />
              <span>{drama.topics.length} topics - click Expand to view</span>
            </div>
          )}
        </div>
      </CardContent>
      <div className="p-4 bg-black/20 border-t border-white/10 mt-4">
        <Button
          onClick={handleDeleteDrama}
          variant="destructive"
          className="w-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:from-[#ff3162] hover:to-[#ff3b1b] text-white font-bold py-2"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          DELETE THIS DRAMA
        </Button>
      </div>
    </Card>
  )
}
