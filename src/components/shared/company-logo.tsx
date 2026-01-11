"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  company: string;
  domain?: string | null;
  logo?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Extract clean domain from URL or domain string
function cleanDomain(input: string): string {
  let domain = input.trim().toLowerCase();

  // Remove protocol
  domain = domain.replace(/^https?:\/\//, "");

  // Remove www.
  domain = domain.replace(/^www\./, "");

  // Remove path (everything after first /)
  domain = domain.split("/")[0];

  // Remove port if present
  domain = domain.split(":")[0];

  return domain;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

function getInitials(company: string): string {
  return company
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromString(str: string): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function CompanyLogo({
  company,
  domain,
  logo,
  size = "md",
  className,
}: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);

  // If we have a custom logo, use it
  if (logo && !imgError) {
    return (
      <div
        className={cn(
          "relative flex-shrink-0 overflow-hidden rounded-lg bg-white",
          sizeClasses[size],
          className
        )}
      >
        <img
          src={logo}
          alt={`${company} logo`}
          className="h-full w-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Try Clearbit if we have a domain
  const clearbitUrl = domain
    ? `https://logo.clearbit.com/${cleanDomain(domain)}`
    : null;

  if (clearbitUrl && !imgError) {
    return (
      <div
        className={cn(
          "relative flex-shrink-0 overflow-hidden rounded-lg bg-white",
          sizeClasses[size],
          className
        )}
      >
        <img
          src={clearbitUrl}
          alt={`${company} logo`}
          className="h-full w-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback to initials
  const initials = getInitials(company);
  const bgColor = getColorFromString(company);

  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center justify-center rounded-lg font-semibold text-white",
        sizeClasses[size],
        bgColor,
        className
      )}
    >
      {initials}
    </div>
  );
}
