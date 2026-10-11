import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Quiz Platform</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Take a job-interview tech quiz by experience level and stack, or measure
          your English with a CEFR-style test. Guests can play; sign in to save scores.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Job interview quiz</CardTitle>
            <CardDescription>
              Choose your experience level and one or more technologies, including
              React, Node.js, MongoDB, TypeScript, NestJS, System Design, Docker,
              Next.js, and DevOps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quiz/tech">
              <Button>Start tech quiz</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CEFR English level test</CardTitle>
            <CardDescription>
              A mixed set of questions from A1 to C2. Your score maps to a CEFR band.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quiz/cefr">
              <Button>Start English test</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
