export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-lg">Page not found</p>
      <a
        href="/"
        className="mt-6 rounded-md bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-black/80"
      >
        Return Home
      </a>
    </div>
  );
}
