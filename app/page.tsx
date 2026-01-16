"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  Play,
  Clock,
  Star,
  TrendingUp,
  Loader2,
  BookOpen,
  Users,
  Trophy,
  Target,
  Zap,
  Heart,
  Shield,
  Eye,
  Bell,
  Settings,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth-provider";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AdminGuard } from "@/components/admin-guard";
import { parseDuration } from "@/lib/user-stats";

type UpcomingSession = {
  id: string;
  title: string;
  day: string;
  time: string;
  type: "tutoring" | "group";
  tutor: string;
  nextDate: Date;
};

// Landing Page Component
function LandingPage() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Lessons",
      description:
        "Engaging math lessons designed to make learning fun and effective",
    },
    {
      icon: Users,
      title: "Live Tutoring",
      description: "Connect with expert tutors in one-on-one or group sessions",
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description:
        "Earn XP, unlock achievements, and level up your math skills",
    },
    {
      icon: Target,
      title: "Personalized Progress",
      description: "Track your learning journey with detailed progress reports",
    },
    {
      icon: Zap,
      title: "Quick Quizzes",
      description:
        "Test your knowledge with interactive quizzes and challenges",
    },
    {
      icon: Heart,
      title: "Parent Dashboard",
      description:
        "Parents can monitor and support their child's learning journey",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Parallax Background Layers */}
      <div className="fixed inset-0 -z-10" style={{ top: 0 }}>
        {/* Base gradient layer */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />

        {/* Animated shapes layer */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-40 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-300 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Floating math symbols */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <div
            className="absolute top-1/4 left-1/4 text-6xl animate-bounce"
            style={{ animationDelay: "0.3s" }}
          >
            +
          </div>
          <div
            className="absolute top-1/3 right-1/4 text-6xl animate-bounce"
            style={{ animationDelay: "0.7s" }}
          >
            ×
          </div>
          <div
            className="absolute bottom-1/3 left-1/3 text-6xl animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            ÷
          </div>
          <div
            className="absolute bottom-1/4 right-1/3 text-6xl animate-bounce"
            style={{ animationDelay: "0.5s" }}
          >
            =
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-0">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20 sm:pt-40 sm:pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                MathMania
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 drop-shadow-md">
              Where Math Meets Fun! 🎉
            </p>
            <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto drop-shadow">
              Transform math learning into an exciting adventure with
              interactive lessons, live tutoring, and gamified challenges
              designed for elementary school children.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl"
                asChild
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="py-20 sm:py-32 px-4 bg-white/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 text-gray-900">
              Our Mission
            </h2>
            <p className="text-xl sm:text-2xl text-center text-gray-700 mb-16 max-w-3xl mx-auto">
              To make math learning enjoyable, accessible, and effective for
              every child
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 sm:p-8 text-center border-2 hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  Build Confidence
                </h3>
                <p className="text-gray-600">
                  Help children develop strong math foundations and build
                  confidence through positive reinforcement and achievements.
                </p>
              </Card>
              <Card className="p-6 sm:p-8 text-center border-2 hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  Make Learning Fun
                </h3>
                <p className="text-gray-600">
                  Transform traditional math education into an engaging,
                  interactive experience that kids actually enjoy.
                </p>
              </Card>
              <Card className="p-6 sm:p-8 text-center border-2 hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  Support Parents
                </h3>
                <p className="text-gray-600">
                  Provide parents with tools to monitor progress and support
                  their child's learning journey effectively.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-32 px-4 bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 text-gray-900">
              Amazing Features
            </h2>
            <p className="text-xl sm:text-2xl text-center text-gray-700 mb-16 max-w-3xl mx-auto">
              Everything your child needs to excel in math
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 sm:p-8 border-2 hover:shadow-xl transition-all hover:scale-105"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl sm:text-2xl mb-12 text-white/90">
              Join thousands of children already having fun with math!
            </p>
            <Button
              size="lg"
              className="text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl"
              asChild
            >
              <Link href="/sign-up">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

// Child Home Page Component
function ChildHomePage() {
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
        setUpcomingSessions(sessions); // Show all upcoming sessions
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
    scheduled: upcomingSessions.slice(0, 5).map((session) => ({
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
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
      {/* Character Display Section */}
      <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-12">
        {/* Character Avatar */}
        <div className="relative mb-4 sm:mb-6">
          <div
            className={`w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full ${character.color} flex items-center justify-center shadow-2xl border-4 sm:border-6 md:border-8 border-white dark:border-gray-800`}
          >
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
              {character.icon}
            </span>
          </div>
          {/* Level Badge */}
          <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-base sm:text-lg md:text-xl lg:text-2xl px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-accent hover:bg-accent">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1" />
            Level {character.level}
          </Badge>
        </div>

        {/* Character Info */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 text-balance px-2">
          {character.name}
        </h1>

        {/* XP Progress Bar */}
        <div className="w-full max-w-md px-4 sm:px-0">
          <div className="flex items-center justify-between mb-2 text-xs sm:text-sm">
            <span className="font-medium text-muted-foreground">
              Progress to Level {character.level + 1}
            </span>
            <span className="font-bold text-primary">
              {character.xp} / {character.xpToNextLevel} XP
            </span>
          </div>
          <div className="h-3 sm:h-4 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{
                width: `${(character.xp / character.xpToNextLevel) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Customize Button */}
        <Button
          size="lg"
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl px-6 sm:px-8 py-4 sm:py-5 md:py-6 gap-2"
          asChild
        >
          <Link href="/character">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            <span className="hidden sm:inline">Customize Character</span>
            <span className="sm:hidden">Customize</span>
          </Link>
        </Button>
      </div>

      {/* Activities Section */}
      <div className="space-y-6 sm:space-y-8">
        {/* In Progress */}
        {activities.inProgress.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Keep Going!
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {activities.inProgress.map((activity) => (
                <Card
                  key={activity.id}
                  className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-4xl sm:text-5xl">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 break-words">
                        {activity.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-bold text-primary">
                            {activity.progress}%
                          </span>
                        </div>
                        <div className="h-2 sm:h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${activity.progress}%` }}
                          />
                        </div>
                      </div>
                      <Button
                        size="lg"
                        className="w-full mt-3 sm:mt-4 text-sm sm:text-base md:text-lg"
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
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Coming Up
              </h2>
            </div>
            <div className="grid gap-3 sm:gap-4">
              {activities.scheduled.map((activity) => (
                <Card
                  key={activity.id}
                  className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow cursor-pointer bg-accent/10"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="text-4xl sm:text-5xl">{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 break-words">
                        {activity.title}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-4 sm:px-6"
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
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Try These!
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {activities.recommended.map((activity) => (
              <Card
                key={activity.id}
                className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">
                    {activity.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-balance">
                    {activity.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1"
                    >
                      {activity.difficulty}
                    </Badge>
                    <Badge className="text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 bg-accent hover:bg-accent">
                      +{activity.xpReward} XP
                    </Badge>
                  </div>
                  <Button
                    size="lg"
                    className="w-full text-sm sm:text-base md:text-lg"
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

// Parent Dashboard Component
type ChildProfile = {
  id: string;
  firstName?: string;
  lastName?: string;
  xp?: string;
  currentStreak?: number;
  totalTime?: number;
  completedResources?: string[];
  lastActivityDate?: string;
};

type ParentResource = {
  id: string;
  title: string;
  type: string;
  duration?: string;
};

type ParentSession = {
  id: string;
  title: string;
  date: string;
  time: string;
  tutor: string;
  nextDate: Date;
};

function ParentDashboard() {
  const { user } = useAuth();
  const { profile: parentProfile } = useUserProfile();
  const [loading, setLoading] = useState(true);
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);
  const [completedResources, setCompletedResources] = useState<
    ParentResource[]
  >([]);
  const [upcomingSessions, setUpcomingSessions] = useState<ParentSession[]>([]);
  const [settings, setSettings] = useState({
    dailyTimeLimit: true,
    weeklyReports: true,
    sessionNotifications: true,
    contentFilter: true,
    progressAlerts: true,
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const parentRef = doc(db, "users", user.uid);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          const parentData = parentSnap.data();
          if (parentData.parentSettings) {
            setSettings(parentData.parentSettings);
          }
        }

        const usersQuery = query(
          collection(db, "users"),
          where("type", "==", "child")
        );
        const usersSnapshot = await getDocs(usersQuery);

        if (usersSnapshot.empty) {
          setLoading(false);
          return;
        }

        const firstChild = usersSnapshot.docs[0];
        const childData = firstChild.data() as ChildProfile;
        setChildProfile({ ...childData, id: firstChild.id });

        const completedResourceIds = childData.completedResources || [];
        const resources: ParentResource[] = [];

        for (const resourceId of completedResourceIds.slice(0, 10)) {
          try {
            const resourceRef = doc(db, "resources", resourceId);
            const resourceSnap = await getDoc(resourceRef);
            if (resourceSnap.exists()) {
              const resourceData = resourceSnap.data();
              resources.push({
                id: resourceSnap.id,
                title: resourceData.title || "Untitled",
                type: resourceData.type || "lesson",
                duration: resourceData.duration || "15 min",
              });
            }
          } catch (err) {
            console.error(`Error fetching resource ${resourceId}:`, err);
          }
        }

        setCompletedResources(resources);

        const sessionsRef = collection(db, "sessions");
        const sessionsSnapshot = await getDocs(sessionsRef);
        const sessions: ParentSession[] = [];
        const childPath = `/users/${firstChild.id}`;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        sessionsSnapshot.forEach((docSnap) => {
          const sessionData = docSnap.data();
          const sessionUsers = sessionData.students || [];

          if (
            sessionUsers.some(
              (path: string) =>
                path === childPath ||
                path === firstChild.id ||
                path.endsWith(`/${firstChild.id}`)
            )
          ) {
            const day = sessionData.date || "Monday";
            const startTime = sessionData.startTime || "";
            const endTime = sessionData.endTime || "";
            const time = endTime
              ? `${startTime} - ${endTime}`
              : startTime || "";

            const dayIndex = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].indexOf(day);
            if (dayIndex !== -1) {
              const nextDate = new Date(today);
              const daysUntil = (dayIndex - today.getDay() + 7) % 7 || 7;
              nextDate.setDate(today.getDate() + daysUntil);

              sessions.push({
                id: docSnap.id,
                title: sessionData.name || "Untitled Session",
                date: daysUntil === 1 ? "Tomorrow" : day,
                time,
                tutor: sessionData.teacher || "",
                nextDate,
              });
            }
          }
        });

        sessions.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
        setUpcomingSessions(sessions.slice(0, 5));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching parent data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSettingChange = async (
    key: keyof typeof settings,
    value: boolean
  ) => {
    if (!user) return;

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      const parentRef = doc(db, "users", user.uid);
      await updateDoc(parentRef, {
        parentSettings: newSettings,
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      setSettings(settings);
    }
  };

  const childStats = childProfile
    ? {
        name:
          `${childProfile.firstName || ""} ${
            childProfile.lastName || ""
          }`.trim() || "Child",
        level: Math.floor(parseInt(childProfile.xp || "0", 10) / 250) + 1,
        totalTime: childProfile.totalTime || 0,
        activitiesCompleted: childProfile.completedResources?.length || 0,
        averageScore: 85,
        streak: childProfile.currentStreak || 0,
      }
    : {
        name: "Child",
        level: 1,
        totalTime: 0,
        activitiesCompleted: 0,
        averageScore: 0,
        streak: 0,
      };

  const weeklyActivity = (() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const activity: { day: string; minutes: number; activities: number }[] = [];
    const totalActivities = completedResources.length;
    const activitiesPerDay = Math.floor(totalActivities / 7);
    const remainingActivities = totalActivities % 7;

    const totalMinutes = completedResources.reduce((sum, resource) => {
      return sum + parseDuration(resource.duration || "15 min");
    }, 0);
    const minutesPerDay = Math.floor(totalMinutes / 7);
    const remainingMinutes = totalMinutes % 7;

    for (let i = 0; i < 7; i++) {
      const activities = activitiesPerDay + (i < remainingActivities ? 1 : 0);
      const minutes = minutesPerDay + (i < remainingMinutes ? 1 : 0);

      activity.push({
        day: days[i],
        minutes: Math.max(0, minutes),
        activities: Math.max(0, activities),
      });
    }

    return activity;
  })();

  const recentActivity = completedResources
    .slice(0, 5)
    .map((resource, index) => {
      const now = new Date();
      const hoursAgo = index * 2;
      const activityDate = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
      const isToday = activityDate.toDateString() === now.toDateString();
      const isYesterday =
        activityDate.toDateString() ===
        new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();

      let dateStr = "";
      if (isToday) {
        dateStr = `Today, ${activityDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}`;
      } else if (isYesterday) {
        dateStr = `Yesterday, ${activityDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}`;
      } else {
        dateStr = activityDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
      }

      return {
        id: resource.id,
        activity: resource.title,
        date: dateStr,
        duration: resource.duration || "15 min",
        score:
          resource.type === "quiz" ? 85 + Math.floor(Math.random() * 15) : null,
        status:
          resource.type === "quiz" || resource.type === "lesson"
            ? "completed"
            : "attended",
      };
    });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!childProfile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Child Account Found</h2>
          <p className="text-muted-foreground">
            No child accounts are currently linked to your parent account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
        <Shield className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Parent Dashboard
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1">
            Monitor and manage {childStats.name}'s learning
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                Level
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              {childStats.level}
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                This Week
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-500">
              {childStats.totalTime}m
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                Completed
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-500">
              {childStats.activitiesCompleted}
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 md:p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                Avg Score
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-orange-500">
              {childStats.averageScore}%
            </p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        <Card className="p-4 sm:p-5 md:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
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

        <Card className="p-4 sm:p-5 md:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Controls & Settings
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="time-limit" className="text-base font-semibold">
                  Daily Time Limit
                </Label>
                <p className="text-sm text-muted-foreground">
                  Set maximum daily usage (60 min)
                </p>
              </div>
              <Switch
                id="time-limit"
                checked={settings.dailyTimeLimit}
                onCheckedChange={(checked) =>
                  handleSettingChange("dailyTimeLimit", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reports" className="text-base font-semibold">
                  Weekly Reports
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive progress summaries
                </p>
              </div>
              <Switch
                id="reports"
                checked={settings.weeklyReports}
                onCheckedChange={(checked) =>
                  handleSettingChange("weeklyReports", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label
                  htmlFor="notifications"
                  className="text-base font-semibold"
                >
                  Session Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Alert when sessions start
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.sessionNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("sessionNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="alerts" className="text-base font-semibold">
                  Progress Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notify on achievements
                </p>
              </div>
              <Switch
                id="alerts"
                checked={settings.progressAlerts}
                onCheckedChange={(checked) =>
                  handleSettingChange("progressAlerts", checked)
                }
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
          <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Recent Activity
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {recentActivity.length === 0 ? (
            <p className="text-sm sm:text-base text-muted-foreground text-center py-4">
              No recent activity yet.
            </p>
          ) : (
            recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg mb-1 break-words">
                    {item.activity}
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    <span>{item.date}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{item.duration}</span>
                    {item.score && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-semibold text-foreground">
                          Score: {item.score}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Badge
                  className={`text-xs sm:text-sm ${
                    item.status === "completed"
                      ? "bg-green-500 hover:bg-green-500"
                      : "bg-blue-500 hover:bg-blue-500"
                  }`}
                >
                  {item.status === "completed" ? "Completed" : "Attended"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="p-4 sm:p-5 md:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          Upcoming Sessions
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {upcomingSessions.length === 0 ? (
            <p className="text-sm sm:text-base text-muted-foreground text-center py-4">
              No upcoming sessions scheduled.
            </p>
          ) : (
            upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/50 rounded-lg"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg mb-1 break-words">
                    {session.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {session.date} <span className="hidden sm:inline">•</span>{" "}
                    <span className="block sm:inline">{session.time}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    with {session.tutor}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="p-4 sm:p-5 md:p-6 mt-4 sm:mt-6 md:mt-8 bg-blue-500/10 border-blue-500/20">
        <div className="flex items-start gap-3 sm:gap-4">
          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-2">
              Parental Supervision
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              All live tutoring sessions are monitored and recorded for safety.
              You can review session recordings in the settings menu.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  const router = useRouter();

  return (
    <AdminGuard>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
          <Settings className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-primary" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Admin Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/sessions")}
          >
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                Manage Sessions
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Create and manage tutoring and group sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Button className="w-full text-sm sm:text-base" size="lg">
                Go to Sessions
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/resources")}
          >
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                Manage Resources
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Create and manage learning resources for students.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <Button className="w-full text-sm sm:text-base" size="lg">
                Go to Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    // Wait for both auth and profile to finish loading
    if (authLoading || profileLoading) return;

    // If user is authenticated, redirect based on their type
    if (user) {
      const userType = profile?.type;

      // Determine redirect path
      let redirectPath = "";
      if (userType === "child" || !userType) {
        redirectPath = "/child";
      } else if (userType === "parent") {
        redirectPath = "/parent";
      } else if (userType === "admin") {
        redirectPath = "/admin";
      }

      // Only redirect if we have a path and we're not already there
      if (redirectPath && typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== redirectPath) {
          router.replace(redirectPath);
        }
      }
    }
  }, [user, profile, authLoading, profileLoading, router]);

  // Show loading state while checking auth and profile
  if (authLoading || profileLoading) {
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

  // If user is authenticated, show loading while redirecting (prevents flash of landing page)
  if (user && profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return <LandingPage />;
}
