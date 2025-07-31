export default function Unauthorized() {
    return (
        <div className="flex items-center justify-center h-screen flex-col">
            <h1>You are Unauthorized to access the page</h1>
            <button className="mt-6 rounded-md bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-black/80"
                onClick={() => window.location.href = "/"}
            >
                Go Back
            </button>
        </div>
    )
}