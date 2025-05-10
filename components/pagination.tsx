"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always show first page
    pageNumbers.push(1)

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push("...")
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("...")
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <div className="flex justify-center items-center mt-8 mb-4">
      <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <Button
                key={index}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 p-0 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="text-white/50 px-1">
                {page}
              </span>
            ),
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
