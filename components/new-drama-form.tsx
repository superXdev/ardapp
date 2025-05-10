"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Flame } from "lucide-react"

interface NewDramaFormProps {
  onSubmit: (kode: string, deskripsi: string) => void
}

export default function NewDramaForm({ onSubmit }: NewDramaFormProps) {
  const [kode, setKode] = useState("")
  const [deskripsi, setDeskripsi] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (kode.trim() && deskripsi.trim()) {
      onSubmit(kode, deskripsi)
      setKode("")
      setDeskripsi("")
    }
  }

  return (
    <Card className="mb-8 bg-[#2a1b3d]/60 backdrop-blur-md border-[#6a11cb]/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Post New Drama</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Kode Drama"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              className="bg-white/5 border-white/10 text-xl font-bold placeholder:text-white/30"
            />
          </div>

          <div>
            <Textarea
              placeholder="Deskripsi Drama"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="bg-white/5 border-white/10 min-h-[100px] placeholder:text-white/30"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6a11cb] to-[#f9d423] hover:from-[#5a0cb6] hover:to-[#e9c413] text-white font-bold py-3 rounded-xl transition-all duration-300"
          >
            <Flame className="w-5 h-5 mr-2" />
            Kirim Drama Baru
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
