"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StarRating } from "@/components/shared/star-rating";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUSES,
  APPLICATION_SOURCES,
  type Application,
  type ApplicationStatus,
  type ApplicationSource,
} from "@/types";

interface ApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: Application | null;
  onSubmit: (data: Partial<Application>) => void;
  defaultStatus?: ApplicationStatus;
}

// Extract clean domain from URL or domain string
function cleanDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/^www\./, "");
  domain = domain.split("/")[0];
  domain = domain.split(":")[0];
  return domain;
}

function inferDomain(company: string): string | null {
  const cleaned = company.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (cleaned) {
    return `${cleaned}.com`;
  }
  return null;
}

export function ApplicationForm({
  open,
  onOpenChange,
  application,
  onSubmit,
  defaultStatus = "SAVED",
}: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    company: "",
    companyDomain: "",
    position: "",
    applicationDate: new Date(),
    status: defaultStatus as ApplicationStatus,
    jobUrl: "",
    salaryMin: "",
    salaryMax: "",
    salaryExpected: "",
    interestLevel: 3,
    source: "OTHER" as ApplicationSource,
    notes: "",
    nextStep: "",
    nextStepDate: null as Date | null,
    cvVersion: "",
    coverLetter: "",
  });

  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company,
        companyDomain: application.companyDomain || "",
        position: application.position,
        applicationDate: new Date(application.applicationDate),
        status: application.status,
        jobUrl: application.jobUrl || "",
        salaryMin: application.salaryMin?.toString() || "",
        salaryMax: application.salaryMax?.toString() || "",
        salaryExpected: application.salaryExpected?.toString() || "",
        interestLevel: application.interestLevel,
        source: application.source,
        notes: application.notes || "",
        nextStep: application.nextStep || "",
        nextStepDate: application.nextStepDate
          ? new Date(application.nextStepDate)
          : null,
        cvVersion: application.cvVersion || "",
        coverLetter: application.coverLetter || "",
      });
    } else {
      setFormData({
        company: "",
        companyDomain: "",
        position: "",
        applicationDate: new Date(),
        status: defaultStatus,
        jobUrl: "",
        salaryMin: "",
        salaryMax: "",
        salaryExpected: "",
        interestLevel: 3,
        source: "OTHER",
        notes: "",
        nextStep: "",
        nextStepDate: null,
        cvVersion: "",
        coverLetter: "",
      });
    }
  }, [application, defaultStatus, open]);

  const handleCompanyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      company: value,
      companyDomain: prev.companyDomain || inferDomain(value) || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
      salaryExpected: formData.salaryExpected
        ? parseInt(formData.salaryExpected)
        : null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {application ? "Edit Application" : "New Application"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleCompanyChange(e.target.value)}
                placeholder="e.g., Google"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyDomain">Domain (for logo)</Label>
              <Input
                id="companyDomain"
                value={formData.companyDomain}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyDomain: e.target.value,
                  }))
                }
                onBlur={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyDomain: e.target.value
                      ? cleanDomain(e.target.value)
                      : "",
                  }))
                }
                placeholder="e.g., google.com or https://google.com"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input
                id="jobUrl"
                type="url"
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, jobUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Status & Source */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as ApplicationStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select
                value={formData.source}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    source: value as ApplicationSource,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPLICATION_SOURCES.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Application Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.applicationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.applicationDate
                      ? format(formData.applicationDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.applicationDate}
                    onSelect={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        applicationDate: date || new Date(),
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Interest Level */}
          <div className="space-y-2">
            <Label>Interest Level</Label>
            <StarRating
              value={formData.interestLevel}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, interestLevel: value }))
              }
            />
          </div>

          {/* Salary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Salary Min</Label>
              <Input
                id="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, salaryMin: e.target.value }))
                }
                placeholder="e.g., 80000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Salary Max</Label>
              <Input
                id="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, salaryMax: e.target.value }))
                }
                placeholder="e.g., 120000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryExpected">My Expectation</Label>
              <Input
                id="salaryExpected"
                type="number"
                value={formData.salaryExpected}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salaryExpected: e.target.value,
                  }))
                }
                placeholder="e.g., 100000"
              />
            </div>
          </div>

          {/* Next Step */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nextStep">Next Step</Label>
              <Input
                id="nextStep"
                value={formData.nextStep}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nextStep: e.target.value }))
                }
                placeholder="e.g., Follow up email"
              />
            </div>
            <div className="space-y-2">
              <Label>Next Step Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.nextStepDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.nextStepDate
                      ? format(formData.nextStepDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.nextStepDate || undefined}
                    onSelect={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        nextStepDate: date || null,
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Documents */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cvVersion">CV Version</Label>
              <Input
                id="cvVersion"
                value={formData.cvVersion}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cvVersion: e.target.value }))
                }
                placeholder="e.g., CV_v2_tech.pdf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Input
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverLetter: e.target.value,
                  }))
                }
                placeholder="e.g., CL_Google.pdf"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {application ? "Save Changes" : "Create Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
