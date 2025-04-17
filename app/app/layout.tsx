// app/app/layout.tsx
import { Toaster } from '@/components/ui/toaster'; // Keep your existing toaster if needed
import ProtectedLayout from '@/components/protected-layout'; // Import the new layout

interface SimplifiedLayoutProps { // Renamed interface for clarity
  children: React.ReactNode;
}

export default function SimplifiedLayout({ children }: SimplifiedLayoutProps) {
  return (
    // Wrap the main content area with ProtectedLayout
    <ProtectedLayout>
      <div className="mx-auto p-6"> {/* Or your existing structure */}
        <div>
          {children}
        </div>
        <Toaster /> {/* Keep toaster if used within the protected area */}
      </div>
    </ProtectedLayout>
  );
}