import { generateId } from "@/lib/id";

/* ---------- Types ---------- */

export type Person = {
  id: string;
  name?: string;
  age?: number;
  email?: string;
  website?: string;
  notes?: string;
  salary?: number;
  department?: string;
  status?: string;
  skills?: string[];
  isActive?: boolean;
  startDate?: string; // ISO date string
  attachments?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
};

/* ---------- Select Options ---------- */

export const departments = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
];

export const statuses = [
  "Active",
  "Onboarding",
  "On Leave",
  "Suspended",
  "Terminated",
];

export const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Go",
  "UI/UX",
  "Figma",
  "SQL",
  "Docker",
];

/* ---------- Initial Table Data ---------- */

export const initialData: Person[] = [
  {
    id: generateId(),
    name: "Nguyen Van An",
    age: 26,
    email: "an.nguyen@company.com",
    website: "https://an.dev",
    notes: "Frontend-focused engineer with strong UI sense.",
    salary: 1800,
    department: "Engineering",
    status: "Active",
    skills: ["TypeScript", "React", "Next.js"],
    isActive: true,
    startDate: "2022-03-14",
    attachments: [],
  },
  {
    id: generateId(),
    name: "Tran Thi Mai",
    age: 29,
    email: "mai.tran@company.com",
    website: "https://mai.design",
    notes: "Leads design system and accessibility initiatives.",
    salary: 2000,
    department: "Design",
    status: "Active",
    skills: ["UI/UX", "Figma"],
    isActive: true,
    startDate: "2021-10-01",
    attachments: [],
  },
  {
    id: generateId(),
    name: "Le Hoang Minh",
    age: 32,
    email: "minh.le@company.com",
    website: "https://minhpm.io",
    notes: "Product-minded PM with engineering background.",
    salary: 2500,
    department: "Product",
    status: "On Leave",
    skills: ["SQL", "JavaScript"],
    isActive: false,
    startDate: "2020-05-20",
    attachments: [],
  },
  {
    id: generateId(),
    name: "Pham Duc Long",
    age: 24,
    email: "long.pham@company.com",
    website: "https://long.dev",
    notes: "Junior backend engineer, learning Go & Docker.",
    salary: 1200,
    department: "Engineering",
    status: "Onboarding",
    skills: ["Go", "Docker"],
    isActive: true,
    startDate: "2024-01-08",
    attachments: [],
  },
  {
    id: generateId(),
    name: "Vo Khanh Linh",
    age: 28,
    email: "linh.vo@company.com",
    website: "https://linh.marketing",
    notes: "Growth-focused marketer with analytics mindset.",
    salary: 1700,
    department: "Marketing",
    status: "Active",
    skills: ["SQL", "JavaScript"],
    isActive: true,
    startDate: "2022-08-15",
    attachments: [],
  },
];
