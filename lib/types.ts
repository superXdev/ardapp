export interface Topic {
  id: string
  type: "link" | "image" | "text"
  content: string
  pembuat: string
  waktu: number
}

export interface Drama {
  id: string
  kode: string
  deskripsi: string
  creator: string
  timestamp: number
  topics: Topic[]
}
