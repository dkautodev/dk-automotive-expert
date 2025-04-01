
import { supabase } from "@/integrations/supabase/client";
import { ContactEntry } from "@/types/addressBook";

export const addressBookService = {
  async getContacts() {
    try {
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select('*')
        .order('lastName', { ascending: true });

      if (error) throw error;
      return contacts;
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  async addContact(contact: Omit<ContactEntry, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contact])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error: any) {
      console.error('Error adding contact:', error);
      throw error;
    }
  },

  async updateContact(id: string, updates: Partial<Omit<ContactEntry, 'id'>>) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error: any) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  async deleteContact(id: string) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
};
