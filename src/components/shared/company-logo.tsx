"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  company: string;
  companyDomain?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
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
    .filter(Boolean)
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

function InitialsFallback({
  company,
  size,
  className,
}: {
  company: string;
  size: "sm" | "md" | "lg";
  className?: string;
}) {
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

export function CompanyLogo({
  company,
  companyDomain,
  size = "md",
  className,
}: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when companyDomain changes
  useEffect(() => {
    setImgError(false);
  }, [companyDomain]);

  // Clean up the website domain (remove protocol, www, trailing slashes)
  const cleanDomain = companyDomain
    ?.replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .trim();

  // Use Google's favicon API (reliable and free)
  const logoUrl = cleanDomain
    ? `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`
    : null;

  // Show logo if we have a domain and no error
  if (logoUrl && !imgError) {
    return (
      <div
        className={cn(
          "relative flex-shrink-0 overflow-hidden rounded-lg bg-white",
          sizeClasses[size],
          className
        )}
      >
        <img
          src={logoUrl}
          alt={`${company} logo`}
          className="h-full w-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback to initials
  return <InitialsFallback company={company} size={size} className={className} />;
}
