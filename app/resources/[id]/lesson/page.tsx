"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, doc, getDoc, runTransaction } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const resourceId = params.id;

  const [resource, setResource] = useState<any>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const ref = doc(collection(db, "resources"), resourceId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setResource(null);
          return;
        }
        const data = snap.data() as any;
        setResource({
          id: snap.id,
          title: data.title ?? "Untitled Lesson",
          xp: typeof data.xp === "number" ? data.xp : 0,
        });
        setContent(data.content ?? "No content available.");
      } catch (err) {
        console.error("Error loading lesson:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [resourceId]);

  useEffect(() => {
    if (!user) return;
    const loadUserProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists()) return;
        const data = snapshot.data() as { completedResources?: string[] };
        if (Array.isArray(data.completedResources)) {
          setIsCompleted(data.completedResources.includes(resourceId));
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };
    loadUserProfile();
  }, [user, resourceId]);

  const handleMarkComplete = async () => {
    if (!user || !resource) return;

    setIsCompleting(true);
    const userRef = doc(db, "users", user.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(userRef);
        if (!snapshot.exists()) {
          throw new Error("User profile not found.");
        }

        const data = snapshot.data() as {
          xp?: string;
          completedResources?: string[];
        };

        const completedResources = Array.isArray(data.completedResources)
          ? data.completedResources
          : [];

        if (completedResources.includes(resourceId)) {
          return;
        }

        const currentXpValue = parseInt(data.xp ?? "0", 10) || 0;
        const newXp = currentXpValue + (resource.xp || 0);

        transaction.update(userRef, {
          xp: String(newXp),
          completedResources: [...completedResources, resourceId],
        });

        setIsCompleted(true);
      });
    } catch (err) {
      console.error("Error marking complete:", err);
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-lg text-muted-foreground">Loading lesson...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-lg">Lesson not found.</p>
        <Button className="mt-4" onClick={() => router.push("/resources")}>
          Back to resources
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/resources")}
      >
        ← Back to resources
      </Button>

      <Card className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">{resource.title}</h1>
        </div>

        <CardContent className="p-0">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-base leading-relaxed">
              {content}
            </div>
          </div>
        </CardContent>

        {!isCompleted && (
          <div className="pt-6 border-t">
            <Button
              size="lg"
              className="w-full text-lg"
              onClick={handleMarkComplete}
              disabled={isCompleting}
            >
              {isCompleting
                ? "Saving..."
                : `Mark as Complete (+${resource.xp} XP)`}
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className="pt-6 border-t">
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-green-700 dark:text-green-300 font-semibold">
                ✓ Lesson completed! You earned {resource.xp} XP.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
