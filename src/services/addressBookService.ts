
import { supabase } from "@/integrations/supabase/client";
import { ContactEntry } from "@/types/addressBook";
import { useAuthContext } from "@/context/AuthContext";
import { safeTable } from "@/utils/supabase-helper";

export const addressBookService = {
  async getContacts() {
    try {
      const { data: contacts, error } = await safeTable('contacts')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      
      // Map the database column names to our frontend model
      return contacts.map(contact => ({
        id: contact.id,
        firstName: contact.first_name,
        lastName: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        type: contact.type as 'pickup' | 'delivery',
        notes: contact.notes
      }));
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  async addContact(contact: Omit<ContactEntry, 'id'>) {
    try {
      // Map our frontend model to the database column names
      const dbContact = {
        first_name: contact.firstName,
        last_name: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        type: contact.type,
        notes: contact.notes,
        user_id: (await supabase.auth.getUser()).data.user?.id // Get the current user ID
      };

      const { data, error } = await safeTable('contacts')
        .insert([dbContact])
        .select();

      if (error) throw error;
      
      // Map the database response back to our frontend model
      return data?.[0] ? {
        id: data[0].id,
        firstName: data[0].first_name,
        lastName: data[0].last_name,
        email: data[0].email,
        phone: data[0].phone,
        type: data[0].type as 'pickup' | 'delivery',
        notes: data[0].notes
      } : undefined;
    } catch (error: any) {
      console.error('Error adding contact:', error);
      throw error;
    }
  },

  async updateContact(id: string, updates: Partial<Omit<ContactEntry, 'id'>>) {
    try {
      // Map our frontend model updates to the database column names
      const dbUpdates: any = {};
      if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
      if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const { data, error } = await safeTable('contacts')
        .update(dbUpdates)
        .eq('id', id)
        .select();

      if (error) throw error;

      // Map the database response back to our frontend model
      return data?.[0] ? {
        id: data[0].id,
        firstName: data[0].first_name,
        lastName: data[0].last_name,
        email: data[0].email,
        phone: data[0].phone,
        type: data[0].type as 'pickup' | 'delivery',
        notes: data[0].notes
      } : undefined;
    } catch (error: any) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  async deleteContact(id: string) {
    try {
      const { error } = await safeTable('contacts')
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
