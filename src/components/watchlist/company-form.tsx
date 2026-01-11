"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { WatchlistCompany } from "@/types";

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: WatchlistCompany | null;
  onSubmit: (data: Partial<WatchlistCompany>) => void;
}

function inferDomain(name: string): string | null {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (cleaned) {
    return `${cleaned}.com`;
  }
  return null;
}

export function CompanyForm({
  open,
  onOpenChange,
  company,
  onSubmit,
}: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    notes: "",
    careersUrl: "",
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        domain: company.domain || "",
        notes: company.notes || "",
        careersUrl: company.careersUrl || "",
      });
    } else {
      setFormData({
        name: "",
        domain: "",
        notes: "",
        careersUrl: "",
      });
    }
  }, [company, open]);

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      domain: prev.domain || inferDomain(value) || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {company ? "Edit Company" : "Add Company to Watchlist"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Stripe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain (for logo)</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, domain: e.target.value }))
              }
              placeholder="e.g., stripe.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="careersUrl">Careers Page URL</Label>
            <Input
              id="careersUrl"
              type="url"
              value={formData.careersUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, careersUrl: e.target.value }))
              }
              placeholder="https://stripe.com/careers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Why I&apos;m interested</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Great engineering culture, interesting products..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {company ? "Save Changes" : "Add to Watchlist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
