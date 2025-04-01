
import { supabase } from "@/integrations/supabase/client";
import { ContactEntry } from "@/types/addressBook";
import { safeTable } from "@/utils/supabase-helper";

export const addressBookService = {
  async getContacts() {
    try {
      const { data: contacts, error } = await safeTable('contacts')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      
      // Map the database column names to our frontend model
      return (contacts || []).map(contact => {
        // Use type assertion to specify that this is a contacts row
        const contactRow = contact as {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          type: string;
          notes: string | null;
        };
        
        return {
          id: contactRow.id,
          firstName: contactRow.first_name,
          lastName: contactRow.last_name,
          email: contactRow.email,
          phone: contactRow.phone,
          type: contactRow.type as 'pickup' | 'delivery',
          notes: contactRow.notes || ''
        };
      });
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
      if (!data || data.length === 0) {
        throw new Error('No data returned after insert');
      }
      
      // Use type assertion for the returned data
      const insertedContact = data[0] as {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        type: string;
        notes: string | null;
      };
      
      return {
        id: insertedContact.id,
        firstName: insertedContact.first_name,
        lastName: insertedContact.last_name,
        email: insertedContact.email,
        phone: insertedContact.phone,
        type: insertedContact.type as 'pickup' | 'delivery',
        notes: insertedContact.notes || ''
      };
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
      if (!data || data.length === 0) {
        throw new Error('No data returned after update');
      }
      
      // Use type assertion for the returned data
      const updatedContact = data[0] as {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        type: string;
        notes: string | null;
      };
      
      return {
        id: updatedContact.id,
        firstName: updatedContact.first_name,
        lastName: updatedContact.last_name,
        email: updatedContact.email,
        phone: updatedContact.phone,
        type: updatedContact.type as 'pickup' | 'delivery',
        notes: updatedContact.notes || ''
      };
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
