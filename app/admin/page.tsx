"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, BookOpen, Settings } from "lucide-react";
import { AdminGuard } from "@/components/admin-guard";

export default function AdminPage() {
  const router = useRouter();

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/sessions")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Manage Sessions
              </CardTitle>
              <CardDescription>
                Create and manage tutoring and group sessions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Go to Sessions
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/resources")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Manage Resources
              </CardTitle>
              <CardDescription>
                Create and manage learning resources for students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Go to Resources
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}
