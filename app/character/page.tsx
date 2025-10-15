"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

export default function CharacterPage() {
  const [selectedCharacter, setSelectedCharacter] = useState("🦊")
  const [selectedColor, setSelectedColor] = useState("bg-gradient-to-br from-blue-400 to-cyan-400")


  const characters = [
    { emoji: "🦊", name: "Fox", unlocked: true },
    { emoji: "🐻", name: "Bear", unlocked: true },
    { emoji: "🐰", name: "Bunny", unlocked: true },
    { emoji: "🐼", name: "Panda", unlocked: true },
    { emoji: "🦁", name: "Lion", unlocked: false, unlockLevel: 10 },
    { emoji: "🐯", name: "Tiger", unlocked: false, unlockLevel: 15 },
    { emoji: "🦄", name: "Unicorn", unlocked: false, unlockLevel: 20 },
    { emoji: "🐉", name: "Dragon", unlocked: false, unlockLevel: 25 },
  ]

  const colors = [
    { name: "Purple Pink", class: "bg-gradient-to-br from-purple-400 to-pink-400" },
    { name: "Blue Cyan", class: "bg-gradient-to-br from-blue-400 to-cyan-400" },
    { name: "Green Lime", class: "bg-gradient-to-br from-green-400 to-lime-400" },
    { name: "Orange Red", class: "bg-gradient-to-br from-orange-400 to-red-400" },
    { name: "Pink Rose", class: "bg-gradient-to-br from-pink-400 to-rose-400" },
    { name: "Indigo Purple", class: "bg-gradient-to-br from-indigo-400 to-purple-400" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-4xl md:text-5xl font-bold">Customize Your Character</h1>
      </div>

      {/* Preview */}
      <Card className="p-8 mb-8">
        <div className="flex flex-col items-center">
          <div
            className={`w-48 h-48 md:w-64 md:h-64 rounded-full ${selectedColor} flex items-center justify-center shadow-2xl border-8 border-white dark:border-gray-800 mb-4`}
          >
            <span className="text-8xl md:text-9xl">{selectedCharacter}</span>
          </div>
          <p className="text-xl text-muted-foreground">Your Math Buddy</p>
        </div>
      </Card>

      {/* Character Selection */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Character</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {characters.map((char) => (
            <Card
              key={char.emoji}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedCharacter === char.emoji ? "ring-4 ring-primary" : ""
              } ${!char.unlocked ? "opacity-50" : ""}`}
              onClick={() => char.unlocked && setSelectedCharacter(char.emoji)}
            >
              <div className="text-center">
                <div className="text-6xl mb-2">{char.emoji}</div>
                <p className="font-bold text-lg">{char.name}</p>
                {!char.unlocked && (
                  <Badge variant="secondary" className="mt-2">
                    Level {char.unlockLevel}
                  </Badge>
                )}
                {selectedCharacter === char.emoji && (
                  <div className="mt-2 flex justify-center">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Color Selection */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Choose Color</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colors.map((color) => (
            <Card
              key={color.name}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedColor === color.class ? "ring-4 ring-primary" : ""
              }`}
              onClick={() => setSelectedColor(color.class)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${color.class} border-4 border-white dark:border-gray-800`} />
                <div className="flex-1">
                  <p className="font-bold text-lg">{color.name}</p>
                  {selectedColor === color.class && <Check className="h-5 w-5 text-primary mt-1" />}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button size="lg" className="text-xl px-12 py-6" asChild>
          <Link href="/">Save Changes</Link>
        </Button>
      </div>
    </div>
  )
}
