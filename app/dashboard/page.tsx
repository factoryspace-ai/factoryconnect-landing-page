import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">FactorySpace Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Welcome to your Dashboard</h2>
          <p className="text-gray-600 mb-4">
            This is your manufacturing control center. Start managing your operations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Active Projects</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Total Orders</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Production Status</h3>
              <p className="text-2xl font-bold">Ready</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
