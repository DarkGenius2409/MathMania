"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, getDocs, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Play, Clock, Star, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth-provider";
import { useUserProfile } from "@/hooks/use-user-profile";

type UpcomingSession = {
  id: string;
  title: string;
  day: string;
  time: string;
  type: "tutoring" | "group";
  tutor: string;
  nextDate: Date;
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [allResources, setAllResources] = useState<any[]>([]);
  const [completedResourceIds, setCompletedResourceIds] = useState<string[]>(
    []
  );
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Calculate character data from profile
  const totalXP = profile ? parseInt(profile.xp || "0", 10) : 0;
  const level = Math.floor(totalXP / 250) + 1; // 250 XP per level
  const xpInCurrentLevel = totalXP % 250;
  const xpToNextLevel = 250;
  const characterName = profile?.firstName
    ? `${profile.firstName}'s Math Buddy`
    : "Math Buddy";
  const characterColor =
    profile?.color || "bg-gradient-to-br from-blue-600 to-blue-300";
  const characterIcon = profile?.character || "🦊";

  const character = {
    level,
    xp: xpInCurrentLevel,
    xpToNextLevel,
    name: characterName,
    color: characterColor,
    icon: characterIcon,
  };

  // Get day of week index (0 = Sunday, 1 = Monday, etc.)
  const getDayIndex = (dayName: string): number => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days.indexOf(dayName);
  };

  // Calculate next occurrence of a day
  const getNextDateForDay = (dayName: string, startTime: string): Date => {
    const today = new Date();
    const dayIndex = getDayIndex(dayName);
    const currentDay = today.getDay();

    let daysUntil = dayIndex - currentDay;
    if (daysUntil < 0) {
      daysUntil += 7; // Next week
    } else if (daysUntil === 0) {
      // Same day - check if time has passed
      if (startTime) {
        const [hours, minutes] = startTime
          .replace(/[APM]/gi, "")
          .split(":")
          .map(Number);
        const isPM = startTime.toUpperCase().includes("PM");
        const sessionHour =
          isPM && hours !== 12 ? hours + 12 : hours === 12 && !isPM ? 0 : hours;
        const sessionTime = new Date(today);
        sessionTime.setHours(sessionHour, minutes || 0, 0, 0);
        if (sessionTime < today) {
          daysUntil = 7; // Next week
        }
      }
    }

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntil);
    return nextDate;
  };

  const formatSessionTime = (date: Date, time: string): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${time.split(" - ")[0]}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${time.split(" - ")[0]}`;
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Fetch resources
  useEffect(() => {
    const resourcesRef = collection(db, "resources");

    const unsubscribe = onSnapshot(
      resourcesRef,
      (snapshot) => {
        const resources: any[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          resources.push({
            id: docSnap.id,
            title: data.title || "Untitled",
            type: data.type || "lesson",
            difficulty: data.difficulty || "Easy",
            xp: typeof data.xp === "number" ? data.xp : 0,
            icon: data.icon || "📚",
            locked: Boolean(data.locked),
          });
        });
        setAllResources(resources);
      },
      (error) => {
        console.error("Error loading resources:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch user profile for completed resources
  useEffect(() => {
    if (!user || !profile) {
      setCompletedResourceIds([]);
      setLoading(false);
      return;
    }

    const completedResources = (profile as any).completedResources || [];
    setCompletedResourceIds(completedResources);
    setLoading(false);
  }, [user, profile]);

  // Fetch upcoming sessions
  useEffect(() => {
    if (!user) {
      setUpcomingSessions([]);
      return;
    }

    const userPath = `/users/${user.uid}`;
    const sessionsRef = collection(db, "sessions");

    const unsubscribe = onSnapshot(
      sessionsRef,
      (snapshot) => {
        const sessions: UpcomingSession[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          const students = Array.isArray(data.students)
            ? (data.students as string[])
            : [];

          if (students.includes(userPath)) {
            const day = data.date || "Monday";
            const startTime = data.startTime || "";
            const nextDate = getNextDateForDay(day, startTime);

            sessions.push({
              id: docSnap.id,
              title: data.name || "Untitled Session",
              day,
              time:
                data.startTime && data.endTime
                  ? `${data.startTime} - ${data.endTime}`
                  : startTime,
              type:
                typeof data.type === "string" &&
                data.type.toLowerCase() === "group"
                  ? "group"
                  : "tutoring",
              tutor: data.teacher || "",
              nextDate,
            });
          }
        });

        sessions.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
        setUpcomingSessions(sessions.slice(0, 1)); // Show only next session
      },
      (error) => {
        console.error("Error loading sessions:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Calculate activities
  const inProgressResources = allResources.filter(
    (resource) =>
      !completedResourceIds.includes(resource.id) &&
      !resource.locked &&
      (resource.type === "lesson" || resource.type === "quiz")
  );

  const activities = {
    inProgress: inProgressResources.slice(0, 2).map((resource) => ({
      id: resource.id,
      title: resource.title,
      progress: 0, // Can't track partial progress without additional data
      type: resource.type,
      icon: resource.icon,
    })),
    scheduled: upcomingSessions.map((session) => ({
      id: session.id,
      title: session.title,
      time: formatSessionTime(session.nextDate, session.time),
      type: session.type,
      icon: session.type === "group" ? "👥" : "👨‍🏫",
    })),
    recommended: allResources
      .filter(
        (resource) =>
          !completedResourceIds.includes(resource.id) &&
          !resource.locked &&
          resource.difficulty === "Easy"
      )
      .slice(0, 3)
      .map((resource) => ({
        id: resource.id,
        title: resource.title,
        difficulty: resource.difficulty,
        xpReward: resource.xp,
        type: resource.type,
        icon: resource.icon,
      })),
  };

  if (loading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
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
            <span className="text-8xl md:text-9xl">{character.icon}</span>
          </div>
          {/* Level Badge */}
          <Badge className="absolute -top-2 -right-2 text-2xl px-4 py-2 bg-accent hover:bg-accent">
            <Star className="h-5 w-5 mr-1" />
            Level {character.level}
          </Badge>
        </div>

        {/* Character Info */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
          {character.name}
        </h1>

        {/* XP Progress Bar */}
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Progress to Level {character.level + 1}
            </span>
            <span className="text-sm font-bold text-primary">
              {character.xp} / {character.xpToNextLevel} XP
            </span>
          </div>
          <div className="h-4 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{
                width: `${(character.xp / character.xpToNextLevel) * 100}%`,
              }}
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
                <Card
                  key={activity.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">
                        {activity.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-bold text-primary">
                            {activity.progress}%
                          </span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                      </div>
                      <Button
                        size="lg"
                        className="w-full mt-4 text-lg"
                        onClick={() =>
                          router.push(
                            `/resources/${activity.id}${
                              activity.type === "quiz"
                                ? "/quiz"
                                : activity.type === "lesson"
                                ? "/lesson"
                                : ""
                            }`
                          )
                        }
                      >
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
                <Card
                  key={activity.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-accent/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-lg text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="text-lg px-6"
                      onClick={() => router.push("/schedule")}
                    >
                      View
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
              <Card
                key={activity.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{activity.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-balance">
                    {activity.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {activity.difficulty}
                    </Badge>
                    <Badge className="text-base px-3 py-1 bg-accent hover:bg-accent">
                      +{activity.xpReward} XP
                    </Badge>
                  </div>
                  <Button
                    size="lg"
                    className="w-full text-lg"
                    onClick={() =>
                      router.push(
                        `/resources/${activity.id}${
                          activity.type === "quiz"
                            ? "/quiz"
                            : activity.type === "lesson"
                            ? "/lesson"
                            : ""
                        }`
                      )
                    }
                  >
                    Start
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
