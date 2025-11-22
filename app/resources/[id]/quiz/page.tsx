"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, doc, getDoc, runTransaction } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Trophy, CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export default function QuizPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const resourceId = params.id;

  const [resource, setResource] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
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
          title: data.title ?? "Untitled Quiz",
          xp: typeof data.xp === "number" ? data.xp : 0,
        });
        setQuestions(Array.isArray(data.questions) ? data.questions : []);
      } catch (err) {
        console.error("Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
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

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });

    const percentage = Math.round((correct / questions.length) * 100);
    setScore(percentage);
    setIsSubmitted(true);
  };

  const handleMarkComplete = async () => {
    if (!user || !resource || score === null) return;

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
        <p className="text-lg text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  if (!resource || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-lg">Quiz not found or has no questions.</p>
        <Button className="mt-4" onClick={() => router.push("/resources")}>
          Back to resources
        </Button>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent work! 🌟";
    if (score >= 80) return "Great job! 🎉";
    if (score >= 70) return "Good effort! 👍";
    if (score >= 60) return "Not bad! Keep practicing! 💪";
    return "Keep studying and try again! 📚";
  };

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

        {!isSubmitted ? (
          <>
            <p className="text-muted-foreground">
              Answer all {questions.length} questions below. Good luck!
            </p>

            <div className="space-y-8">
              {questions.map((q, index) => (
                <Card key={index} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-1">
                        Question {index + 1}
                      </Badge>
                      <h3 className="text-xl font-semibold flex-1">
                        {q.question}
                      </h3>
                    </div>

                    <RadioGroup
                      value={answers[index]?.toString()}
                      onValueChange={(value) =>
                        setAnswers({ ...answers, [index]: parseInt(value, 10) })
                      }
                      className="space-y-3"
                    >
                      {q.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={optIndex.toString()}
                            id={`q${index}-opt${optIndex}`}
                          />
                          <Label
                            htmlFor={`q${index}-opt${optIndex}`}
                            className="font-normal cursor-pointer flex-1"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </Card>
              ))}
            </div>

            <Button size="lg" className="w-full text-lg" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          </>
        ) : (
          <>
            <div className="text-center space-y-4 py-8">
              <Trophy className="h-16 w-16 mx-auto text-primary" />
              <div>
                <h2 className="text-4xl font-bold mb-2">Your Score</h2>
                <p className={`text-6xl font-bold ${getScoreColor(score!)}`}>
                  {score}%
                </p>
                <p className="text-xl text-muted-foreground mt-4">
                  {getScoreMessage(score!)}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((q, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <Card
                    key={index}
                    className={`p-6 ${
                      isCorrect
                        ? "bg-green-50 dark:bg-green-950/20"
                        : "bg-red-50 dark:bg-red-950/20"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <h3 className="text-lg font-semibold">{q.question}</h3>
                      </div>
                      <div className="space-y-2 pl-7">
                        {q.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex;
                          const isCorrectAnswer = q.correctAnswer === optIndex;
                          return (
                            <div
                              key={optIndex}
                              className={`p-2 rounded ${
                                isCorrectAnswer
                                  ? "bg-green-200 dark:bg-green-900/30 font-semibold"
                                  : isUserAnswer
                                  ? "bg-red-200 dark:bg-red-900/30"
                                  : ""
                              }`}
                            >
                              {option}
                              {isCorrectAnswer && " ✓"}
                              {isUserAnswer && !isCorrectAnswer && " ✗"}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {!isCompleted && (
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
            )}

            {isCompleted && (
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-semibold">
                  ✓ Quiz completed! You earned {resource.xp} XP.
                </p>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
