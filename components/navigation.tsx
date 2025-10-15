"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Calendar, BarChart3, BookOpen, Shield } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/dashboard", label: "Progress", icon: BarChart3 },
    { href: "/resources", label: "Resources", icon: BookOpen },
  ]

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="text-3xl font-bold text-blue-900">MathMania</span>
            <span className="text-xs text-muted-foreground">Welcome to the World of Math</span>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="lg"
                  className="text-lg gap-2"
                >
                  <Link href={item.href}>
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
          </div>

          {/* Parent Controls Button */}
          <Button variant="outline" size="lg" asChild className="hidden md:flex gap-2 bg-transparent">
            <Link href="/parent">
              <Shield className="h-5 w-5" />
              Parent
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around pb-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "default" : "ghost"}
                size="lg"
                className="flex-1 flex-col h-auto py-3 gap-1"
              >
                <Link href={item.href}>
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              </Button>
            )
          })}
          <Button
            asChild
            variant={pathname === "/parent" ? "default" : "ghost"}
            size="lg"
            className="flex-1 flex-col h-auto py-3 gap-1"
          >
            <Link href="/parent">
              <Shield className="h-6 w-6" />
              <span className="text-xs">Parent</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
