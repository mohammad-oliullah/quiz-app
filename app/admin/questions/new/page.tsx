import { QuestionForm } from "@/components/admin/question-form";

export default function NewQuestionPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Add question</h1>
      <QuestionForm />
    </div>
  );
}
