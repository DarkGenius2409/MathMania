"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth-provider";

type SessionType = "tutoring" | "group";

type SessionDoc = {
  id: string;
  title: string;
  time: string;
  type: SessionType;
  tutor: string;
  maxOccupancy?: number;
  users: string[];
};

type SessionsByDay = Record<string, SessionDoc[]>;

export default function SchedulePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedDay, setSelectedDay] = useState(2); // Tuesday selected by default
  const [sessions, setSessions] = useState<SessionsByDay>({});
  const [joiningSessionId, setJoiningSessionId] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const currentDaySessions = sessions[days[selectedDay]] || [];

  useEffect(() => {
    const sessionsRef = collection(db, "sessions");

    const unsubscribe = onSnapshot(
      sessionsRef,
      (snapshot) => {
        const grouped: SessionsByDay = {};

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          const day: string = data.date || "Monday";

          const session: SessionDoc = {
            id: docSnap.id,
            title: data.name || "Untitled Session",
            time:
              data.startTime && data.endTime
                ? `${data.startTime} - ${data.endTime}`
                : data.startTime || "",
            type:
              typeof data.type === "string" &&
              data.type.toLowerCase() === "group"
                ? "group"
                : "tutoring",
            tutor: data.teacher || "",
            maxOccupancy:
              typeof data.maxSpots === "number" ? data.maxSpots : undefined,
            users: Array.isArray(data.students)
              ? (data.students as string[])
              : [],
          };

          if (!grouped[day]) {
            grouped[day] = [];
          }
          grouped[day].push(session);
        });

        setSessions(grouped);
        setLoading(false);
      },
      (error) => {
        setJoinError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleJoinSession = async (sessionId: string) => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const userPath = `/users/${user.uid}`;

    setJoiningSessionId(sessionId);
    setJoinError(null);

    try {
      const sessionRef = doc(db, "sessions", sessionId);

      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(sessionRef);

        if (!snapshot.exists()) {
          throw new Error("Session not found.");
        }

        const data = snapshot.data() as {
          students?: string[];
          maxSpots?: number;
          isFull?: boolean;
        };

        const students = data.students ?? [];
        const maxSpots = data.maxSpots;

        if (students.includes(userPath)) {
          // Already joined; nothing to do.
          return;
        }

        if (typeof maxSpots === "number" && students.length >= maxSpots) {
          throw new Error("This session is already full.");
        }

        const updatedStudents = [...students, userPath];
        const isFull =
          typeof maxSpots === "number"
            ? updatedStudents.length >= maxSpots
            : false;

        transaction.update(sessionRef, {
          students: updatedStudents,
          isFull,
        });
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to join this session. Please try again.";
      setJoinError(message);
    } finally {
      setJoiningSessionId(null);
    }
  };

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

        {loading && (
          <p className="text-lg text-muted-foreground">Loading sessions...</p>
        )}

        {joinError && (
          <p className="text-red-600 text-lg" role="alert">
            {joinError}
          </p>
        )}

        {currentDaySessions.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-2xl text-muted-foreground">
                No sessions scheduled for this day
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {currentDaySessions.map((session) => {
              const isEnrolled = user
                ? session.users.includes(user.uid)
                : false;
              const availableSpots =
                typeof session.maxOccupancy === "number"
                  ? Math.max(session.maxOccupancy - session.users.length, 0)
                  : null;

              return (
                <Card
                  key={session.id}
                  className={`p-6 hover:shadow-lg transition-shadow ${
                    isEnrolled ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                        session.type === "tutoring"
                          ? "bg-primary/20"
                          : "bg-accent/20"
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
                        <Badge
                          variant={
                            session.type === "tutoring"
                              ? "default"
                              : "secondary"
                          }
                          className="text-base"
                        >
                          {session.type === "tutoring"
                            ? "1-on-1 Tutoring"
                            : "Group Study"}
                        </Badge>
                        {isEnrolled && (
                          <Badge className="text-base bg-green-500 hover:bg-green-500">
                            Enrolled
                          </Badge>
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
                            {availableSpots !== null
                              ? `${availableSpots} spot${
                                  availableSpots !== 1 ? "s" : ""
                                } available`
                              : "Spots available"}
                          </span>
                        </div>
                      </div>

                      <p className="text-lg">
                        <span className="text-muted-foreground">with</span>{" "}
                        <span className="font-semibold">{session.tutor}</span>
                      </p>
                    </div>

                    {/* Action Button */}
                    <Button
                      size="lg"
                      className="text-xl px-8 py-6 md:shrink-0"
                      disabled={isEnrolled || joiningSessionId === session.id}
                      onClick={() => handleJoinSession(session.id)}
                    >
                      {isEnrolled
                        ? "Enrolled"
                        : joiningSessionId === session.id
                        ? "Joining..."
                        : "Join Session"}
                    </Button>
                  </div>
                </Card>
              );
            })}
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
              Ask your parent to help you join a session. All sessions are live
              and interactive!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
