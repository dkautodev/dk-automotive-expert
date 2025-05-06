
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
      
      return (data || []).map(contact => ({
        id: contact.id,
        firstName: contact.first_name,
        lastName: contact.last_name,
        email: contact.email,
        phone: contact.phone,
        type: contact.type,
        notes: contact.notes || '',
        company: contact.company || '',
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return [];
    }
  },

  async addContact(contact: Omit<ContactEntry, "id">) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          first_name: contact.firstName,
          last_name: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          type: contact.type,
          notes: contact.notes || '',
          company: contact.company || '',
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("No data returned from insert");
      }
      
      const newContact = data[0];
      return {
        id: newContact.id,
        firstName: newContact.first_name,
        lastName: newContact.last_name,
        email: newContact.email,
        phone: newContact.phone,
        type: newContact.type,
        notes: newContact.notes || '',
        company: newContact.company || '',
      };
    } catch (error) {
      console.error("Error adding contact:", error);
      throw error;
    }
  },

  async updateContact(id: string, updates: Partial<Omit<ContactEntry, "id">>) {
    try {
      const updateData: Record<string, any> = {};
      if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
      if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.company !== undefined) updateData.company = updates.company;

      const { data, error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("No data returned from update");
      }
      
      const updatedContact = data[0];
      return {
        id: updatedContact.id,
        firstName: updatedContact.first_name,
        lastName: updatedContact.last_name,
        email: updatedContact.email,
        phone: updatedContact.phone,
        type: updatedContact.type,
        notes: updatedContact.notes || '',
        company: updatedContact.company || '',
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
