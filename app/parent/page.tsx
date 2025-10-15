"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Clock,
  Eye,
  Bell,
  Settings,
  TrendingUp,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

export default function ParentPage() {
  const [settings, setSettings] = useState({
    dailyTimeLimit: true,
    weeklyReports: true,
    sessionNotifications: true,
    contentFilter: true,
    progressAlerts: true,
  })

  // Mock data
  const childStats = {
    name: "Alex",
    level: 5,
    totalTime: 180, // minutes this week
    activitiesCompleted: 24,
    averageScore: 89,
    streak: 7,
  }

  const weeklyActivity = [
    { day: "Mon", minutes: 30, activities: 4 },
    { day: "Tue", minutes: 25, activities: 3 },
    { day: "Wed", minutes: 35, activities: 5 },
    { day: "Thu", minutes: 20, activities: 3 },
    { day: "Fri", minutes: 40, activities: 6 },
    { day: "Sat", minutes: 15, activities: 2 },
    { day: "Sun", minutes: 15, activities: 1 },
  ]

  const recentActivity = [
    {
      id: 1,
      activity: "Addition Quiz Level 3",
      date: "Today, 3:45 PM",
      duration: "12 min",
      score: 95,
      status: "completed",
    },
    {
      id: 2,
      activity: "Live Tutoring Session",
      date: "Today, 3:00 PM",
      duration: "45 min",
      score: null,
      status: "attended",
    },
    {
      id: 3,
      activity: "Multiplication Practice",
      date: "Yesterday, 4:20 PM",
      duration: "18 min",
      score: 88,
      status: "completed",
    },
  ]

  const upcomingSessions = [
    {
      id: 1,
      title: "Multiplication Magic",
      date: "Tomorrow",
      time: "3:00 PM - 3:45 PM",
      tutor: "Ms. Emily",
    },
    {
      id: 2,
      title: "Math Games Hour",
      date: "Friday",
      time: "4:00 PM - 5:00 PM",
      tutor: "Ms. Lisa",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">Parent Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-1">Monitor and manage {childStats.name}'s learning</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Level</span>
            </div>
            <p className="text-3xl font-bold text-primary">{childStats.level}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
            <p className="text-3xl font-bold text-blue-500">{childStats.totalTime}m</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-3xl font-bold text-green-500">{childStats.activitiesCompleted}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">Avg Score</span>
            </div>
            <p className="text-3xl font-bold text-orange-500">{childStats.averageScore}%</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Activity Chart */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Weekly Activity
          </h2>
          <div className="space-y-4">
            {weeklyActivity.map((day) => (
              <div key={day.day}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{day.day}</span>
                  <span className="text-sm text-muted-foreground">
                    {day.minutes} min • {day.activities} activities
                  </span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${(day.minutes / 45) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Parental Controls */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Controls & Settings
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="time-limit" className="text-base font-semibold">
                  Daily Time Limit
                </Label>
                <p className="text-sm text-muted-foreground">Set maximum daily usage (60 min)</p>
              </div>
              <Switch
                id="time-limit"
                checked={settings.dailyTimeLimit}
                onCheckedChange={(checked) => setSettings({ ...settings, dailyTimeLimit: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reports" className="text-base font-semibold">
                  Weekly Reports
                </Label>
                <p className="text-sm text-muted-foreground">Receive progress summaries</p>
              </div>
              <Switch
                id="reports"
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications" className="text-base font-semibold">
                  Session Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Alert when sessions start</p>
              </div>
              <Switch
                id="notifications"
                checked={settings.sessionNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, sessionNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="content" className="text-base font-semibold">
                  Content Filter
                </Label>
                <p className="text-sm text-muted-foreground">Age-appropriate content only</p>
              </div>
              <Switch
                id="content"
                checked={settings.contentFilter}
                onCheckedChange={(checked) => setSettings({ ...settings, contentFilter: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="alerts" className="text-base font-semibold">
                  Progress Alerts
                </Label>
                <p className="text-sm text-muted-foreground">Notify on achievements</p>
              </div>
              <Switch
                id="alerts"
                checked={settings.progressAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, progressAlerts: checked })}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Eye className="h-6 w-6 text-primary" />
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b last:border-0"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{item.activity}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.duration}</span>
                  {item.score && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-foreground">Score: {item.score}%</span>
                    </>
                  )}
                </div>
              </div>
              <Badge
                className={
                  item.status === "completed" ? "bg-green-500 hover:bg-green-500" : "bg-blue-500 hover:bg-blue-500"
                }
              >
                {item.status === "completed" ? "Completed" : "Attended"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming Sessions */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          Upcoming Sessions
        </h2>
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{session.title}</h3>
                <p className="text-muted-foreground">
                  {session.date} • {session.time}
                </p>
                <p className="text-sm text-muted-foreground mt-1">with {session.tutor}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Info Alert */}
      <Card className="p-6 mt-8 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg mb-2">Parental Supervision</h3>
            <p className="text-muted-foreground">
              All live tutoring sessions are monitored and recorded for safety. You can review session recordings in the
              settings menu.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
