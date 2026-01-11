"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Linkedin,
  Mail,
  Building2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ContactForm } from "./contact-form";
import { ContactDetail } from "./contact-detail";
import { EmptyState } from "@/components/shared/empty-state";
import type { Contact, Interaction, Reminder } from "@/types";

interface ContactWithRelations extends Contact {
  interactions: Interaction[];
  reminders: Reminder[];
}

export function ContactList() {
  const [contacts, setContacts] = useState<ContactWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingContact, setEditingContact] =
    useState<ContactWithRelations | null>(null);
  const [selectedContact, setSelectedContact] =
    useState<ContactWithRelations | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: Partial<Contact>) => {
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const newContact = await response.json();
      setContacts((prev) => [
        { ...newContact, interactions: [], reminders: [] },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleEdit = async (data: Partial<Contact>) => {
    if (!editingContact) return;

    try {
      const response = await fetch(`/api/contacts/${editingContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updatedContact = await response.json();
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingContact.id
            ? { ...updatedContact, interactions: c.interactions, reminders: c.reminders }
            : c
        )
      );
      setEditingContact(null);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleAddInteraction = async (
    contactId: string,
    content: string,
    date: Date
  ) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, date }),
      });
      const newInteraction = await response.json();
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contactId
            ? { ...c, interactions: [newInteraction, ...c.interactions] }
            : c
        )
      );
      if (selectedContact?.id === contactId) {
        setSelectedContact((prev) =>
          prev
            ? { ...prev, interactions: [newInteraction, ...prev.interactions] }
            : null
        );
      }
    } catch (error) {
      console.error("Error adding interaction:", error);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.company?.toLowerCase().includes(search.toLowerCase()) ||
      contact.position?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Contact List */}
      <div className="flex w-full flex-col md:max-w-2xl md:border-r">
        {/* Header - Sticky on mobile */}
        <div className="sticky top-0 z-10 border-b bg-background p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold md:text-2xl">Contacts</h1>
              <p className="text-sm text-muted-foreground md:text-base">
                Manage your professional network
              </p>
            </div>
            <Button onClick={() => setFormOpen(true)} size="sm" className="md:size-default">
              <Plus className="mr-1 h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">New Contact</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          <div className="mt-3 relative md:mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No contacts yet"
              description="Add your first contact to start building your network"
              action={
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              }
            />
          ) : (
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors md:gap-4 md:p-4 ${
                    selectedContact?.id === contact.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <Avatar className="h-10 w-10 md:h-10 md:w-10">
                    <AvatarFallback className="text-sm">{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate text-sm md:text-base">{contact.name}</h4>
                      {contact.reminders.length > 0 && (
                        <Badge variant="secondary" className="text-[10px] md:text-xs">
                          {contact.reminders.length}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate md:text-sm">
                      {contact.position && contact.company
                        ? `${contact.position} at ${contact.company}`
                        : contact.position || contact.company || "No details"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 md:gap-2">
                    {/* Hide social icons on mobile to save space */}
                    <div className="hidden md:flex md:items-center md:gap-2">
                      {contact.linkedinUrl && (
                        <a
                          href={contact.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingContact(contact);
                            setFormOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(contact.id);
                          }}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Detail Panel - Desktop Only */}
      <div className="hidden flex-1 md:block">
        {selectedContact ? (
          <ContactDetail
            contact={selectedContact}
            onAddInteraction={(content, date) =>
              handleAddInteraction(selectedContact.id, content, date)
            }
            onEdit={() => {
              setEditingContact(selectedContact);
              setFormOpen(true);
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a contact to view details
          </div>
        )}
      </div>

      {/* Mobile Contact Detail Sheet */}
      <Sheet
        open={!!selectedContact}
        onOpenChange={(open) => {
          if (!open) setSelectedContact(null);
        }}
      >
        <SheetContent side="right" className="w-full p-0 sm:max-w-full md:hidden">
          {selectedContact && (
            <div className="flex h-full flex-col">
              {/* Mobile Header */}
              <div className="flex items-center gap-2 border-b p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedContact(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="font-medium">Contact Details</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ContactDetail
                  contact={selectedContact}
                  onAddInteraction={(content, date) =>
                    handleAddInteraction(selectedContact.id, content, date)
                  }
                  onEdit={() => {
                    setEditingContact(selectedContact);
                    setFormOpen(true);
                  }}
                />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <ContactForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingContact(null);
        }}
        contact={editingContact}
        onSubmit={editingContact ? handleEdit : handleCreate}
      />
    </div>
  );
}
