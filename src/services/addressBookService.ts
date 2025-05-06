
import { supabase } from "@/integrations/supabase/client";
import { ContactEntry } from "@/types/addressBook";

export const addressBookService = {
  async getContacts() {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      
      const contacts = data || [];
      
      // Map the database column names to our frontend model
      return contacts.map(contact => ({
        id: contact.id,
        firstName: contact.first_name,
        lastName: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        type: contact.type,
        notes: contact.notes || ''
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  },

  async addContact(contact: ContactEntry) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          first_name: contact.firstName,
          last_name: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          type: contact.type,
          notes: contact.notes,
          user_id: (await supabase.auth.getUser()).data.user?.id || ''
        })
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("No data returned from insert");
      }
      
      return {
        id: data[0].id,
        firstName: data[0].first_name,
        lastName: data[0].last_name,
        email: data[0].email,
        phone: data[0].phone,
        type: data[0].type,
        notes: data[0].notes || ''
      };
    } catch (error) {
      console.error("Error adding contact:", error);
      throw error;
    }
  },

  async updateContact(contact: ContactEntry) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({
          first_name: contact.firstName,
          last_name: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          type: contact.type,
          notes: contact.notes
        })
        .eq('id', contact.id)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("No data returned from update");
      }
      
      return {
        id: data[0].id,
        firstName: data[0].first_name,
        lastName: data[0].last_name,
        email: data[0].email,
        phone: data[0].phone,
        type: data[0].type,
        notes: data[0].notes || ''
      };
    } catch (error) {
      console.error("Error updating contact:", error);
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
    } catch (error) {
      console.error("Error deleting contact:", error);
      return false;
    }
  }
};
