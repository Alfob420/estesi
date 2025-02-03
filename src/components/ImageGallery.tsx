'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ImageGalleryProps {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      <div 
        className="relative h-[400px] cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            Ver todas las fotos ({images.length})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.slice(1).map((imagen, index) => (
          <div 
            key={index} 
            className="relative h-24 cursor-pointer"
            onClick={() => {
              setCurrentImageIndex(index + 1)
              setIsOpen(true)
            }}
          >
            <Image
              src={imagen}
              alt={`${title} - ${index + 2}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-4xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="relative h-[80vh]">
              <Image
                src={images[currentImageIndex]}
                alt={`${title} - ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
            >
              <ChevronLeftIcon className="h-8 w-8" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
            >
              <ChevronRightIcon className="h-8 w-8" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
              {currentImageIndex + 1} / {images.length}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
} 