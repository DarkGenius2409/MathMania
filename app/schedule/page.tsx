"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Video, ChevronLeft, ChevronRight } from "lucide-react"

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(2) // Tuesday selected by default

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const sessions = {
    Monday: [
      {
        id: 1,
        title: "Addition Basics",
        time: "3:00 PM - 3:45 PM",
        type: "tutoring",
        tutor: "Ms. Sarah",
        spots: 3,
        enrolled: false,
      },
      {
        id: 2,
        title: "Homework Help",
        time: "4:00 PM - 5:00 PM",
        type: "group",
        tutor: "Mr. John",
        spots: 8,
        enrolled: false,
      },
    ],
    Tuesday: [
      {
        id: 3,
        title: "Multiplication Magic",
        time: "3:00 PM - 3:45 PM",
        type: "tutoring",
        tutor: "Ms. Emily",
        spots: 2,
        enrolled: true,
      },
      {
        id: 4,
        title: "Math Games Hour",
        time: "4:00 PM - 5:00 PM",
        type: "group",
        tutor: "Ms. Lisa",
        spots: 12,
        enrolled: false,
      },
    ],
    Wednesday: [
      {
        id: 5,
        title: "Division Workshop",
        time: "3:00 PM - 3:45 PM",
        type: "tutoring",
        tutor: "Mr. David",
        spots: 4,
        enrolled: false,
      },
      {
        id: 6,
        title: "Problem Solving Club",
        time: "4:30 PM - 5:30 PM",
        type: "group",
        tutor: "Ms. Rachel",
        spots: 10,
        enrolled: false,
      },
    ],
    Thursday: [
      {
        id: 7,
        title: "Fractions Fun",
        time: "3:00 PM - 3:45 PM",
        type: "tutoring",
        tutor: "Ms. Sarah",
        spots: 3,
        enrolled: false,
      },
      {
        id: 8,
        title: "Study Buddies",
        time: "4:00 PM - 5:00 PM",
        type: "group",
        tutor: "Mr. John",
        spots: 15,
        enrolled: false,
      },
    ],
    Friday: [
      {
        id: 9,
        title: "Math Challenge",
        time: "3:00 PM - 4:00 PM",
        type: "tutoring",
        tutor: "Ms. Emily",
        spots: 5,
        enrolled: false,
      },
      {
        id: 10,
        title: "Weekend Prep",
        time: "4:30 PM - 5:30 PM",
        type: "group",
        tutor: "Ms. Lisa",
        spots: 8,
        enrolled: false,
      },
    ],
    Saturday: [
      {
        id: 11,
        title: "Morning Math",
        time: "10:00 AM - 11:00 AM",
        type: "group",
        tutor: "Mr. David",
        spots: 12,
        enrolled: false,
      },
    ],
    Sunday: [
      {
        id: 12,
        title: "Week Review",
        time: "2:00 PM - 3:00 PM",
        type: "group",
        tutor: "Ms. Rachel",
        spots: 10,
        enrolled: false,
      },
    ],
  }

  const currentDaySessions = sessions[days[selectedDay] as keyof typeof sessions] || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="h-10 w-10 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold">Schedule</h1>
      </div>

      {/* Day Selector */}
      <Card className="p-4 mb-8">
        <div className="flex items-center gap-2">
          <Button
            size="lg"
            variant="ghost"
            onClick={() => setSelectedDay((prev) => (prev > 0 ? prev - 1 : 6))}
            className="shrink-0"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2 min-w-max px-2">
              {days.map((day, index) => (
                <Button
                  key={day}
                  size="lg"
                  variant={selectedDay === index ? "default" : "outline"}
                  onClick={() => setSelectedDay(index)}
                  className="text-lg px-6 whitespace-nowrap"
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            variant="ghost"
            onClick={() => setSelectedDay((prev) => (prev < 6 ? prev + 1 : 0))}
            className="shrink-0"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </Card>

      {/* Sessions List */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">{days[selectedDay]} Sessions</h2>

        {currentDaySessions.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-2xl text-muted-foreground">No sessions scheduled for this day</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {currentDaySessions.map((session) => (
              <Card
                key={session.id}
                className={`p-6 hover:shadow-lg transition-shadow ${
                  session.enrolled ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                      session.type === "tutoring" ? "bg-primary/20" : "bg-accent/20"
                    }`}
                  >
                    {session.type === "tutoring" ? (
                      <Video className="h-8 w-8 text-primary" />
                    ) : (
                      <Users className="h-8 w-8 text-accent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-bold">{session.title}</h3>
                      <Badge variant={session.type === "tutoring" ? "default" : "secondary"} className="text-base">
                        {session.type === "tutoring" ? "1-on-1 Tutoring" : "Group Study"}
                      </Badge>
                      {session.enrolled && (
                        <Badge className="text-base bg-green-500 hover:bg-green-500">Enrolled</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-lg text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span>
                          {session.spots} spot{session.spots !== 1 ? "s" : ""} available
                        </span>
                      </div>
                    </div>

                    <p className="text-lg">
                      <span className="text-muted-foreground">with</span>{" "}
                      <span className="font-semibold">{session.tutor}</span>
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button size="lg" className="text-xl px-8 py-6 md:shrink-0" disabled={session.enrolled}>
                    {session.enrolled ? "Enrolled" : "Join Session"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <Card className="p-6 mt-8 bg-secondary/50">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
            <p className="text-lg text-muted-foreground">
              Ask your parent to help you join a session. All sessions are live and interactive!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
