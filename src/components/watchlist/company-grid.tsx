"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyCard } from "./company-card";
import { CompanyForm } from "./company-form";
import { EmptyState } from "@/components/shared/empty-state";
import type { WatchlistCompany } from "@/types";

export function CompanyGrid() {
  const [companies, setCompanies] = useState<WatchlistCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<WatchlistCompany | null>(
    null
  );

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/watchlist");
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: Partial<WatchlistCompany>) => {
    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const newCompany = await response.json();
      setCompanies((prev) => [newCompany, ...prev]);
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  const handleEdit = async (data: Partial<WatchlistCompany>) => {
    if (!editingCompany) return;

    try {
      const response = await fetch(`/api/watchlist/${editingCompany.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updatedCompany = await response.json();
      setCompanies((prev) =>
        prev.map((c) => (c.id === editingCompany.id ? updatedCompany : c))
      );
      setEditingCompany(null);
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this company from your watchlist?")) return;

    try {
      await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const openEditForm = (company: WatchlistCompany) => {
    setEditingCompany(company);
    setFormOpen(true);
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.notes?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <div>
          <h1 className="text-xl font-bold md:text-2xl">Watchlist</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Companies you&apos;re interested in exploring
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} size="sm" className="md:size-default">
          <Plus className="mr-1 h-4 w-4 md:mr-2" />
          <span className="hidden sm:inline">Add Company</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {companies.length > 0 && (
        <div className="mb-4 relative md:mb-6 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {filteredCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies in watchlist"
          description="Add companies you're interested in to track them for future opportunities"
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CompanyForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingCompany(null);
        }}
        company={editingCompany}
        onSubmit={editingCompany ? handleEdit : handleCreate}
      />
    </div>
  );
}
