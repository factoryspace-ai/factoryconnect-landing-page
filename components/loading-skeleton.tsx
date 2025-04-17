'use client';

import React from 'react';
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'table' | 'form' | 'defaultPage';
  count?: number;
}

export function LoadingSkeleton({ 
  className,
  variant = 'default',
  count = 1,
  ...props 
}: SkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'defaultPage':
        return (
          <div className="flex flex-col items-center justify-center h-screen w-full animate-pulse">
            <div className="w-3/4 mb-6">
              <div className="h-10 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-3/4 mb-6">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                  <div className="h-24 bg-gray-300 rounded-md animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
                </div>
              ))}
            </div>
            <div className="w-3/4 mb-6">
              <div className="h-10 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-4 gap-4">
                  {Array(4).fill(0).map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'card':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                <div className="h-48 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="space-y-4">
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-4 gap-4">
                  {Array(4).fill(0).map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'form':
        return (
          <div className="space-y-6 max-w-2xl mx-auto">
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {Array(count).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div 
      className={cn(
        "w-full animate-in fade-in-50 duration-500", 
        className
      )}
      {...props}
    >
      {renderSkeleton()}
    </div>
  );
}

// Loading wrapper component
export function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0">
        <div className="h-16 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-full">
              {/* <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div> */}
              <div className="flex space-x-4">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="h-12 w-3/4 md:w-1/2 bg-gray-200 rounded animate-pulse mx-auto mb-6"></div>
            <div className="h-6 w-2/3 md:w-1/3 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>

          {/* Content Section */}
          <LoadingSkeleton variant="card" count={6} />
        </div>
      </main>
    </div>
  );
}

// Loading spinner component
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}
