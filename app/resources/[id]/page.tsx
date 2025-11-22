"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, doc, getDoc, runTransaction } from "firebase/firestore";
import { ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/resources";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";

export default function ResourceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentXp, setCurrentXp] = useState<number | null>(null);

  const resourceId = params.id;

  useEffect(() => {
    const loadResource = async () => {
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
          title: data.title ?? "Untitled resource",
          type: data.type ?? "lesson",
          difficulty: data.difficulty ?? "Easy",
          duration: data.duration ?? "N/A",
          xp: typeof data.xp === "number" ? data.xp : 0,
          locked: Boolean(data.locked),
          icon: data.icon ?? "📚",
          description: data.description ?? "",
          url: data.url,
          unlockLevel: data.unlockLevel,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load resource.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [resourceId]);

  useEffect(() => {
    if (!user) return;

    const loadUserProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists()) return;

        const data = snapshot.data() as {
          xp?: string;
          completedResources?: string[];
        };
        const xp = parseInt(data.xp ?? "0", 10) || 0;
        setCurrentXp(xp);
        if (Array.isArray(data.completedResources)) {
          setIsCompleted(data.completedResources.includes(resourceId));
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };

    loadUserProfile();
  }, [user, resourceId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-lg text-muted-foreground">Loading resource...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-lg">Resource not found.</p>
        <Button className="mt-4" onClick={() => router.push("/resources")}>
          Back to resources
        </Button>
      </div>
    );
  }

  const handleStartResource = () => {
    if (resource.type === "quiz") {
      router.push(`/resources/${resourceId}/quiz`);
    } else if (resource.type === "lesson") {
      router.push(`/resources/${resourceId}/lesson`);
    } else if (resource.url) {
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleMarkComplete = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    setIsCompleting(true);
    setError(null);

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
          // Already completed; don't award XP again.
          return;
        }

        const currentXpValue = parseInt(data.xp ?? "0", 10) || 0;
        const newXp = currentXpValue + (resource.xp || 0);

        transaction.update(userRef, {
          xp: String(newXp),
          completedResources: [...completedResources, resourceId],
        });

        setCurrentXp(newXp);
        setIsCompleted(true);
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to mark as complete.";
      setError(message);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
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

        <p className="text-muted-foreground text-lg">{resource.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge>{resource.type}</Badge>
          <Badge variant="secondary">{resource.difficulty}</Badge>
          <Badge variant="outline">{resource.duration}</Badge>
          {resource.xp > 0 && (
            <Badge className="bg-accent hover:bg-accent">
              +{resource.xp} XP
            </Badge>
          )}
        </div>

        {typeof currentXp === "number" && (
          <p className="text-sm text-muted-foreground">
            Your current XP: <span className="font-semibold">{currentXp}</span>
          </p>
        )}

        <div className="space-y-3">
          {resource.type === "quiz" || resource.type === "lesson" ? (
            <Button
              size="lg"
              className="w-full md:w-auto text-lg gap-2"
              onClick={handleStartResource}
            >
              <BookOpen className="h-5 w-5" />
              {resource.type === "quiz" ? "Start Quiz" : "Read Lesson"}
            </Button>
          ) : resource.url ? (
            <Button
              size="lg"
              className="w-full md:w-auto text-lg gap-2"
              variant="outline"
              onClick={handleStartResource}
            >
              <ExternalLink className="h-5 w-5" />
              Open resource
            </Button>
          ) : null}

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      </Card>
    </div>
  );
}
