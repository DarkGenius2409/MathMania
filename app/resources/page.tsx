"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, FileQuestion, Download, Play, Lock } from "lucide-react"

type ResourceType = "all" | "lessons" | "videos" | "quizzes" | "downloads"

export default function ResourcesPage() {
  const [selectedType, setSelectedType] = useState<ResourceType>("all")

  const resources = [
    {
      id: 1,
      title: "Addition Basics",
      type: "lesson",
      difficulty: "Easy",
      duration: "15 min",
      xp: 50,
      locked: false,
      icon: "📚",
      description: "Learn the fundamentals of adding numbers",
      url: "https://www.khanacademy.org/math/cc-2nd-grade-math/x3184e0ec:add-and-subtract-within-20/x3184e0ec:add-within-20/v/adding-within-20-example",
    },
    {
      id: 2,
      title: "Counting Fun",
      type: "video",
      difficulty: "Easy",
      duration: "8 min",
      xp: 30,
      locked: false,
      icon: "🎬",
      description: "Watch and learn to count with fun animations",
      url: "https://www.youtube.com/watch?v=uONIJ5TQ2DA",
    },
    {
      id: 3,
      title: "Addition Quiz Level 1",
      type: "quiz",
      difficulty: "Easy",
      duration: "10 min",
      xp: 60,
      locked: false,
      icon: "🎯",
      description: "Test your addition skills with 10 questions",
    },
    {
      id: 4,
      title: "Math Practice Worksheets",
      type: "download",
      difficulty: "Easy",
      duration: "N/A",
      xp: 0,
      locked: false,
      icon: "📄",
      description: "Printable worksheets for extra practice",
      url: "/worksheets/addition-practice.pdf",
    },
    {
      id: 5,
      title: "Subtraction Mastery",
      type: "lesson",
      difficulty: "Medium",
      duration: "20 min",
      xp: 75,
      locked: false,
      icon: "📖",
      description: "Master the art of subtraction",
      url: "https://www.youtube.com/watch?v=VScM8Z8Jls0",
    },
    {
      id: 6,
      title: "Multiplication Tables",
      type: "video",
      difficulty: "Medium",
      duration: "12 min",
      xp: 50,
      locked: false,
      icon: "🎥",
      description: "Learn multiplication tables 1-10",
      url: "https://www.youtube.com/watch?v=7J1OkxuyLD0",
    },
    {
      id: 7,
      title: "Multiplication Challenge",
      type: "quiz",
      difficulty: "Medium",
      duration: "15 min",
      xp: 80,
      locked: false,
      icon: "🏆",
      description: "Challenge yourself with multiplication problems",
    },
    {
      id: 8,
      title: "Division Deep Dive",
      type: "lesson",
      difficulty: "Hard",
      duration: "25 min",
      xp: 100,
      locked: true,
      icon: "📕",
      description: "Advanced division techniques",
      unlockLevel: 10,
      url: "https://www.youtube.com/watch?v=BZ4FjSXjzgg",
    },
    {
      id: 9,
      title: "Fractions Explained",
      type: "video",
      difficulty: "Hard",
      duration: "18 min",
      xp: 90,
      locked: true,
      icon: "🎞️",
      description: "Understanding fractions visually",
      unlockLevel: 12,
      url: "https://www.khanacademy.org/math/cc-fifth-grade-math/imp-fractions-3/imp-adding-and-subtracting-fractions-with-unlike-denominators/v/adding-fractions-with-unlike-denominators-introduction",
    },
    {
      id: 10,
      title: "Advanced Math Quiz",
      type: "quiz",
      difficulty: "Hard",
      duration: "20 min",
      xp: 120,
      locked: true,
      icon: "💎",
      description: "Ultimate math challenge for experts",
      unlockLevel: 15,
      url: "https://www.youtube.com/watch?v=fsTD_jqseBA",
    },
    {
      id: 11,
      title: "Basic Operations Worksheets",
      type: "download",
      difficulty: "Easy",
      duration: "N/A",
      xp: 0,
      locked: false,
      icon: "📄",
      description: "Printable worksheets for addition, subtraction, and more",
      url: "https://www.homeschoolmath.net/worksheets/basic-operations-worksheets.php",
    },
    {
      id: 12,
      title: "Math Salamanders Worksheets",
      type: "download",
      difficulty: "Easy",
      duration: "N/A",
      xp: 0,
      locked: false,
      icon: "📋",
      description: "Fun worksheets covering all basic operations",
      url: "https://www.math-salamanders.com/addition-subtraction-multiplication-division-worksheets.html",
    },
  ]

  const filterButtons: { type: ResourceType; label: string; icon: any }[] = [
    { type: "all", label: "All", icon: BookOpen },
    { type: "lessons", label: "Lessons", icon: BookOpen },
    { type: "videos", label: "Videos", icon: Video },
    { type: "quizzes", label: "Quizzes", icon: FileQuestion },
    { type: "downloads", label: "Downloads", icon: Download },
  ]

  const filteredResources =
    selectedType === "all" ? resources : resources.filter((r) => r.type === selectedType.slice(0, -1))

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-purple-500"
      case "video":
        return "bg-pink-500"
      case "quiz":
        return "bg-blue-500"
      case "download":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-700 dark:text-green-300"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
      case "Hard":
        return "bg-red-500/20 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300"
    }
  }

  const handleResourceClick = (resource: (typeof resources)[0]) => {
    if (resource.locked) return

    if (resource.url) {
      // Open external links in new tab
      window.open(resource.url, "_blank", "noopener,noreferrer")
    } else {
      // For quizzes without URLs, could navigate to a quiz page
      console.log("[v0] Starting quiz:", resource.title)
      // TODO: Navigate to quiz page when implemented
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="h-10 w-10 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold">Resources</h1>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filterButtons.map((button) => {
          const Icon = button.icon
          return (
            <Button
              key={button.type}
              size="lg"
              variant={selectedType === button.type ? "default" : "outline"}
              onClick={() => setSelectedType(button.type)}
              className="text-lg gap-2"
            >
              <Icon className="h-5 w-5" />
              {button.label}
            </Button>
          )
        })}
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className={`p-6 hover:shadow-lg transition-shadow ${resource.locked ? "opacity-75" : "cursor-pointer"}`}
          >
            <div className="space-y-4">
              {/* Icon and Type Badge */}
              <div className="flex items-start justify-between">
                <div className="text-6xl">{resource.icon}</div>
                <Badge className={`${getTypeColor(resource.type)} capitalize`}>{resource.type}</Badge>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-balance">{resource.title}</h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground">{resource.description}</p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className={getDifficultyColor(resource.difficulty)}>
                  {resource.difficulty}
                </Badge>
                <Badge variant="outline">{resource.duration}</Badge>
                {resource.xp > 0 && <Badge className="bg-accent hover:bg-accent">+{resource.xp} XP</Badge>}
              </div>

              {/* Action Button */}
              {resource.locked ? (
                <Button size="lg" className="w-full text-lg gap-2" disabled>
                  <Lock className="h-5 w-5" />
                  Level {resource.unlockLevel} Required
                </Button>
              ) : (
                <Button size="lg" className="w-full text-lg gap-2" onClick={() => handleResourceClick(resource)}>
                  {resource.type === "download" ? (
                    <>
                      <Download className="h-5 w-5" />
                      Download
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-2xl text-muted-foreground">No resources found</p>
          </div>
        </Card>
      )}
    </div>
  )
}
