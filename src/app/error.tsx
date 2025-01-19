'use client'
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <button
        className="mt-6 rounded-md bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-black/80"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
