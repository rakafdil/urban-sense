'use client'

import { X } from 'lucide-react'

interface ImageViewerProps {
  src: string
  alt: string
  onClose: () => void
}

export default function ImageViewer({ src, alt, onClose }: ImageViewerProps) {
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 p-1.5 sm:p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary z-10 shadow-lg"
        >
          <X size={18} />
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] rounded-xl border border-border shadow-2xl object-contain"
        />
      </div>
    </div>
  )
}