'use client'

import ContactForm from '@/components/ContactForm'

export default function ContactoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="content-section p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contacto</h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-200/80">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
} 