"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Video,
  FileQuestion,
  Download,
  Play,
  Lock,
} from "lucide-react";
import type { Resource } from "@/lib/resources";
import { db } from "@/lib/firebase";

type ResourceType = "all" | "lessons" | "videos" | "quizzes" | "downloads";

export default function ResourcesPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ResourceType>("all");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterButtons: { type: ResourceType; label: string; icon: any }[] = [
    { type: "all", label: "All", icon: BookOpen },
    { type: "lessons", label: "Lessons", icon: BookOpen },
    { type: "videos", label: "Videos", icon: Video },
    { type: "quizzes", label: "Quizzes", icon: FileQuestion },
    { type: "downloads", label: "Downloads", icon: Download },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);

    const resourcesRef = collection(db, "resources");

    const unsubscribe = onSnapshot(
      resourcesRef,
      (snapshot) => {
        try {
          const loaded: Resource[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data() as any;
            return {
              id: docSnap.id,
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
            };
          });
          setResources(loaded);
          setLoading(false);
        } catch (err) {
          console.error("Error processing resources:", err);
          setError("Error processing resource data.");
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error loading resources:", error);
        setError(error.message || "Unable to load resources.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredResources: Resource[] =
    selectedType === "all"
      ? resources
      : resources.filter((r) => r.type === selectedType.slice(0, -1));

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-purple-500";
      case "video":
        return "bg-pink-500";
      case "quiz":
        return "bg-blue-500";
      case "download":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-700 dark:text-green-300";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300";
      case "Hard":
        return "bg-red-500/20 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300";
    }
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.locked) return;

    router.push(`/resources/${resource.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="h-10 w-10 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold">Resources</h1>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filterButtons.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.type}
              size="lg"
              variant={selectedType === button.type ? "default" : "outline"}
              onClick={() => setSelectedType(button.type)}
              className="text-lg gap-2"
            >
              <Icon className="h-5 w-5" />
              {button.label}
            </Button>
          );
        })}
      </div>

      {loading && (
        <p className="text-lg text-muted-foreground mb-4">
          Loading resources...
        </p>
      )}
      {error && (
        <p className="text-lg text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className={`p-6 hover:shadow-lg transition-shadow ${
              resource.locked ? "opacity-75" : "cursor-pointer"
            }`}
          >
            <div className="space-y-4">
              {/* Icon and Type Badge */}
              <div className="flex items-start justify-between">
                <div className="text-6xl">{resource.icon}</div>
                <Badge className={`${getTypeColor(resource.type)} capitalize`}>
                  {resource.type}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-balance">
                {resource.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {resource.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className={getDifficultyColor(resource.difficulty)}
                >
                  {resource.difficulty}
                </Badge>
                <Badge variant="outline">{resource.duration}</Badge>
                {resource.xp > 0 && (
                  <Badge className="bg-accent hover:bg-accent">
                    +{resource.xp} XP
                  </Badge>
                )}
              </div>

              {/* Action Button */}
              {resource.locked ? (
                <Button size="lg" className="w-full text-lg gap-2" disabled>
                  <Lock className="h-5 w-5" />
                  Level {resource.unlockLevel} Required
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full text-lg gap-2"
                  onClick={() => handleResourceClick(resource)}
                >
                  {resource.type === "download" ? (
                    <>
                      <Download className="h-5 w-5" />
                      Download
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && !error && filteredResources.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-2xl text-muted-foreground">
              {resources.length === 0
                ? "No resources available"
                : `No ${
                    selectedType === "all" ? "" : selectedType
                  } resources found`}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
