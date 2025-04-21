"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from "react"

interface TopNavbarProps {
  className?: string;
  items: {
    id: string
    title: string
    icon?: React.ReactNode
  }[]
  defaultTab?: string
  onChange?: (tabId: string) => void
}

export function TopNavbar({ className, items, defaultTab, onChange, ...props }: TopNavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || defaultTab || items[0]?.id
  
  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tabId)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-full">
      {/* Mobile dropdown version */}
      <div className="sm:hidden">
        <select 
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={activeTab}
          onChange={(e) => handleTabChange(e.target.value)}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop horizontal tabs */}
      <ScrollArea className="hidden w-full sm:block">
        <div className="flex border-b">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.title}</span>
              </div>
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
