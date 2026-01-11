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
  companyDomain: string | null;
  companyLogo: string | null;
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
  cvVersion: string | null;
  coverLetter: string | null;
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
  domain: string | null;
  logo: string | null;
  notes: string | null;
  careersUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
