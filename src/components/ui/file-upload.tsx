"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  currentUrl?: string | null;
  currentFileName?: string | null;
  onUpload: (url: string, fileName: string) => void;
  onRemove: () => void;
  accept?: string;
  disabled?: boolean;
  applicationId?: string;
  fileType: "cv" | "coverLetter";
}

export function FileUpload({
  label,
  currentUrl,
  currentFileName,
  onUpload,
  onRemove,
  accept = ".pdf,.doc,.docx",
  disabled = false,
  applicationId,
  fileType,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileType);
      if (applicationId) {
        formData.append("applicationId", applicationId);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      onUpload(data.url, data.fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      
      {currentUrl && currentFileName ? (
        <div className="flex items-center gap-2 rounded-md border p-2">
          <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
          <span className="flex-1 truncate text-sm">{currentFileName}</span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              asChild
            >
              <a href={currentUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-4 transition-colors",
            isUploading
              ? "border-primary/50 bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
          
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="mt-2 text-sm text-muted-foreground">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="mt-2 text-sm text-muted-foreground">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-muted-foreground">
                PDF, DOC, DOCX (max 10MB)
              </span>
            </>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
