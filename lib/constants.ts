export const TECHNOLOGIES = [
  { id: "react", label: "React" },
  { id: "docker", label: "Docker" },
  { id: "sql-nd-sql-dbms", label: "SQL and NoSQL DBMS" },
  { id: "nextjs", label: "Next.js" },
  { id: "devops", label: "DevOps" },
  { id: "mongodb", label: "MongoDB" },
  { id: "nodejs", label: "Node.js" },
  { id: "system-design", label: "System Design" },
  { id: "typescript", label: "TypeScript" },
] as const;

export const TECH_LEVELS = [
  { id: "fresher", label: "Fresher (0-1 yr)" },
  { id: "junior", label: "Junior (1-4 yr)" },
  { id: "senior", label: "Senior (4+ yr)" },
] as const;

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export const TECH_QUIZ_SIZE = 15;
export const CEFR_QUIZ_SIZE = 30;

export type TechnologyId = (typeof TECHNOLOGIES)[number]["id"];
export type TechLevel = (typeof TECH_LEVELS)[number]["id"];
export type CefrLevel = (typeof CEFR_LEVELS)[number];
