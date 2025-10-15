"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Trophy, Target, TrendingUp, Star, CheckCircle2, Clock } from "lucide-react"

export default function DashboardPage() {
  // Mock data - in real app, this would come from a database
  const stats = {
    totalXP: 1250,
    level: 5,
    activitiesCompleted: 24,
    currentStreak: 7,
    totalTime: 180, // minutes
  }

  const skillProgress = [
    { skill: "Addition", progress: 85, color: "bg-purple-500" },
    { skill: "Subtraction", progress: 70, color: "bg-pink-500" },
    { skill: "Multiplication", progress: 45, color: "bg-blue-500" },
    { skill: "Division", progress: 30, color: "bg-green-500" },
  ]

  const recentActivities = [
    {
      id: 1,
      title: "Addition Quiz Level 3",
      type: "quiz",
      completed: true,
      xp: 50,
      date: "Today",
      score: 95,
    },
    {
      id: 2,
      title: "Multiplication Practice",
      type: "lesson",
      completed: true,
      xp: 75,
      date: "Yesterday",
      score: 88,
    },
    {
      id: 3,
      title: "Shape Explorer Game",
      type: "game",
      completed: true,
      xp: 60,
      date: "2 days ago",
      score: 100,
    },
    {
      id: 4,
      title: "Subtraction Challenge",
      type: "challenge",
      completed: true,
      xp: 80,
      date: "3 days ago",
      score: 92,
    },
  ]

  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first activity", unlocked: true, icon: "🎯" },
    { id: 2, title: "Quick Learner", description: "Reach Level 5", unlocked: true, icon: "⚡" },
    { id: 3, title: "Week Warrior", description: "7 day streak", unlocked: true, icon: "🔥" },
    { id: 4, title: "Math Master", description: "Complete 50 activities", unlocked: false, icon: "👑" },
    { id: 5, title: "Perfect Score", description: "Get 100% on 10 quizzes", unlocked: false, icon: "💯" },
    { id: 6, title: "Level 10", description: "Reach Level 10", unlocked: false, icon: "⭐" },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="h-10 w-10 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold">Your Progress</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.totalXP}</p>
            <p className="text-sm text-muted-foreground mt-1">Total XP</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-3">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
            <p className="text-3xl font-bold text-accent">{stats.level}</p>
            <p className="text-sm text-muted-foreground mt-1">Level</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-500">{stats.activitiesCompleted}</p>
            <p className="text-sm text-muted-foreground mt-1">Completed</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-orange-500">{stats.currentStreak}</p>
            <p className="text-sm text-muted-foreground mt-1">Day Streak</p>
          </div>
        </Card>
      </div>

      {/* Skills Progress */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Skills Progress
        </h2>
        <Card className="p-6">
          <div className="space-y-6">
            {skillProgress.map((skill) => (
              <div key={skill.skill}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold">{skill.skill}</span>
                  <span className="text-lg font-bold text-primary">{skill.progress}%</span>
                </div>
                <Progress value={skill.progress} className="h-4" />
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Recent Activities */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Clock className="h-8 w-8 text-primary" />
          Recent Activities
        </h2>
        <div className="grid gap-4">
          {recentActivities.map((activity) => (
            <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{activity.title}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {activity.type}
                    </Badge>
                    <Badge className="bg-green-500 hover:bg-green-500">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Completed
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <span>{activity.date}</span>
                    <span>•</span>
                    <span className="font-semibold text-primary">+{activity.xp} XP</span>
                    <span>•</span>
                    <span className="font-semibold text-foreground">Score: {activity.score}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 shrink-0">
                  <span className="text-2xl font-bold text-primary">{activity.score}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Achievements
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`p-6 ${achievement.unlocked ? "bg-gradient-to-br from-primary/10 to-accent/10" : "opacity-60"}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  {achievement.unlocked ? (
                    <Badge className="bg-green-500 hover:bg-green-500">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Unlocked
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Locked</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
