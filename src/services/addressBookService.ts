
import { ContactEntry } from "@/types/addressBook";
import { mockContactService } from "@/services/contact/mockContactService";

export const addressBookService = {
  async getContacts() {
    return await mockContactService.getContacts();
  },

  async addContact(contact: Omit<ContactEntry, "id">) {
    return await mockContactService.addContact(contact);
  },

  async updateContact(id: string, updates: Partial<Omit<ContactEntry, "id">>) {
    return await mockContactService.updateContact(id, updates);
  },

  async deleteContact(id: string) {
    return await mockContactService.deleteContact(id);
  }
};
