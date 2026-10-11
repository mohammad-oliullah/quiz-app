import { config } from "dotenv";

config({ path: ".env.local" });
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db";
import { Question } from "../models/Question";
import { User } from "../models/User";
import { buildSeedQuestions } from "./question-bank";

async function seed() {
  await connectDB();

  const questions = buildSeedQuestions();
  await Question.deleteMany({});
  await Question.insertMany(questions);

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@quiz.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin12345";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      name: "Admin",
      email: adminEmail,
      passwordHash,
      provider: "credentials",
      role: "admin",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const techCount = await Question.countDocuments({ quizType: "tech" });
  const cefrCount = await Question.countDocuments({ quizType: "cefr" });
  console.log(`Seeded ${techCount} tech questions and ${cefrCount} CEFR questions.`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
