export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "ARCHIVED";

export type ApplicationSource =
  | "LINKEDIN"
  | "INDEED"
  | "REFERRAL"
  | "COMPANY_WEBSITE"
  | "OTHER";

export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  { value: "SAVED", label: "Saved", color: "bg-slate-500" },
  { value: "APPLIED", label: "Applied", color: "bg-blue-500" },
  { value: "INTERVIEW", label: "Interview", color: "bg-yellow-500" },
  { value: "OFFER", label: "Offer", color: "bg-green-500" },
  { value: "REJECTED", label: "Rejected", color: "bg-red-500" },
  { value: "ARCHIVED", label: "Archived", color: "bg-gray-400" },
];

export const APPLICATION_SOURCES: {
  value: ApplicationSource;
  label: string;
}[] = [
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "INDEED", label: "Indeed" },
  { value: "REFERRAL", label: "Referral" },
  { value: "COMPANY_WEBSITE", label: "Company Website" },
  { value: "OTHER", label: "Other" },
];

export interface Application {
  id: string;
  company: string;
  companyLogo: string | null;
  companyDomain: string | null;
  position: string;
  applicationDate: Date;
  status: ApplicationStatus;
  jobUrl: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryExpected: number | null;
  interestLevel: number;
  source: ApplicationSource;
  notes: string | null;
  nextStep: string | null;
  nextStepDate: Date | null;
  cvUrl: string | null;
  cvFileName: string | null;
  coverLetterUrl: string | null;
  coverLetterFileName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  linkedinUrl: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  interactions?: Interaction[];
  reminders?: Reminder[];
  tasks?: Task[];
}

export interface Interaction {
  id: string;
  contactId: string;
  content: string;
  date: Date;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  contactId: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

export interface WatchlistCompany {
  id: string;
  name: string;
  logo: string | null;
  notes: string | null;
  careersUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  completed: boolean;
  link: string | null;
  applicationId: string | null;
  application?: {
    id: string;
    company: string;
    position: string;
    companyDomain: string | null;
  } | null;
  watchlistId: string | null;
  watchlist?: {
    id: string;
    name: string;
    careersUrl: string | null;
  } | null;
  contactId: string | null;
  contact?: {
    id: string;
    name: string;
    company: string | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  type?: "task" | "nextStep";
}
