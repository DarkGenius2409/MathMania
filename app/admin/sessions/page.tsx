"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { db } from "@/lib/firebase";
import { AdminGuard } from "@/components/admin-guard";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AdminSessionsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState<"Tutoring" | "Group">("Tutoring");
  const [teacher, setTeacher] = useState("");
  const [maxSpots, setMaxSpots] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!name.trim() || !date || !startTime || !endTime || !teacher.trim()) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, "sessions"), {
        name: name.trim(),
        date,
        startTime,
        endTime,
        type,
        teacher: teacher.trim(),
        maxSpots: maxSpots ? parseInt(maxSpots, 10) : undefined,
        students: [],
        isFull: false,
      });

      setSuccess(true);
      setName("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setTeacher("");
      setMaxSpots("");
      setType("Tutoring");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to create session. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/admin")}
        >
          ← Back to Admin Dashboard
        </Button>
        <div className="flex items-center gap-3 mb-8">
          <Calendar className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold">Create Session</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>New Session</CardTitle>
            <CardDescription>
              Add a new tutoring or group session to the schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Session Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Addition Basics"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Day of Week *</Label>
                <Select value={date} onValueChange={setDate} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Session Type *</Label>
                <Select
                  value={type}
                  onValueChange={(value) =>
                    setType(value as "Tutoring" | "Group")
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tutoring">Tutoring</SelectItem>
                    <SelectItem value="Group">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher Name *</Label>
                <Input
                  id="teacher"
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="e.g., Ms. Sarah"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSpots">Max Spots (Optional)</Label>
                <Input
                  id="maxSpots"
                  type="number"
                  min="1"
                  value={maxSpots}
                  onChange={(e) => setMaxSpots(e.target.value)}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>
                    Session created successfully!
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Creating..." : "Create Session"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/admin")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}
