import InquiryForm from '@/components/InquiryForm'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-matte-black text-white relative overflow-hidden">
      {/* Background radial gradient for subtle depth */}
      <div className="absolute inset-0 z-0 bg-radial-at-t from-charcoal to-matte-black opacity-50" />
      
      <div className="relative z-10 w-full max-w-lg">
        <InquiryForm />
      </div>
    </main>
  )
}
