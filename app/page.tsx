"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Play, Clock, Star, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  // Mock character data - in real app, this would come from a database
  const [character] = useState({
    level: 5,
    xp: 350,
    xpToNextLevel: 500,
    name: "Math Buddy",
    color: "bg-gradient-to-br from-blue-600 to-blue-300",
  })

  // Mock activity data
  const activities = {
    inProgress: [
      {
        id: 1,
        title: "Addition Adventure",
        progress: 60,
        type: "lesson",
        icon: "📚",
      },
      {
        id: 2,
        title: "Multiplication Quiz",
        progress: 30,
        type: "quiz",
        icon: "🎯",
      },
    ],
    scheduled: [
      {
        id: 3,
        title: "Live Tutoring Session",
        time: "Today at 3:00 PM",
        type: "tutoring",
        icon: "👨‍🏫",
      },
    ],
    recommended: [
      {
        id: 4,
        title: "Subtraction Challenge",
        difficulty: "Easy",
        xpReward: 50,
        type: "challenge",
        icon: "⭐",
      },
      {
        id: 5,
        title: "Number Patterns",
        difficulty: "Medium",
        xpReward: 75,
        type: "lesson",
        icon: "🔢",
      },
      {
        id: 6,
        title: "Shape Explorer",
        difficulty: "Easy",
        xpReward: 50,
        type: "game",
        icon: "🔷",
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Character Display Section */}
      <div className="flex flex-col items-center mb-12">
        {/* Character Avatar */}
        <div className="relative mb-6">
          <div
            className={`w-48 h-48 md:w-64 md:h-64 rounded-full ${character.color} flex items-center justify-center shadow-2xl border-8 border-white dark:border-gray-800`}
          >
            <span className="text-8xl md:text-9xl">🦊</span>
          </div>
          {/* Level Badge */}
          <Badge className="absolute -top-2 -right-2 text-2xl px-4 py-2 bg-accent hover:bg-accent">
            <Star className="h-5 w-5 mr-1" />
            Level {character.level}
          </Badge>
        </div>

        {/* Character Info */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">{character.name}</h1>

        {/* XP Progress Bar */}
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Progress to Level {character.level + 1}</span>
            <span className="text-sm font-bold text-primary">
              {character.xp} / {character.xpToNextLevel} XP
            </span>
          </div>
          <div className="h-4 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${(character.xp / character.xpToNextLevel) * 100}%` }}
            />
          </div>
        </div>

        {/* Customize Button */}
        <Button size="lg" className="mt-6 text-xl px-8 py-6 gap-2" asChild>
          <Link href="/character">
            <Sparkles className="h-6 w-6" />
            Customize Character
          </Link>
        </Button>
      </div>

      {/* Activities Section */}
      <div className="space-y-8">
        {/* In Progress */}
        {activities.inProgress.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Play className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Keep Going!</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {activities.inProgress.map((activity) => (
                <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-bold text-primary">{activity.progress}%</span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                      </div>
                      <Button size="lg" className="w-full mt-4 text-lg">
                        Continue
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Scheduled */}
        {activities.scheduled.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-6 w-6 text-accent" />
              <h2 className="text-3xl font-bold">Coming Up</h2>
            </div>
            <div className="grid gap-4">
              {activities.scheduled.map((activity) => (
                <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-accent/10">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">{activity.title}</h3>
                      <p className="text-lg text-muted-foreground">{activity.time}</p>
                    </div>
                    <Button size="lg" className="text-lg px-6">
                      Join
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Recommended */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Try These!</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {activities.recommended.map((activity) => (
              <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="text-6xl mb-4">{activity.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-balance">{activity.title}</h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {activity.difficulty}
                    </Badge>
                    <Badge className="text-base px-3 py-1 bg-accent hover:bg-accent">+{activity.xpReward} XP</Badge>
                  </div>
                  <Button size="lg" className="w-full text-lg">
                    Start
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
