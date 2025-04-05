
import { ContactEntry } from '@/types/addressBook';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import { Edit, Trash2, UserCircle, Mail, Phone } from 'lucide-react';

interface ContactListProps {
  contacts: ContactEntry[];
  onEdit: (contact: ContactEntry) => void;
  onDelete: (id: string) => void;
  onFillForm?: (contact: ContactEntry) => void;
  formatContactDisplay?: (contact: ContactEntry) => string;
}

const ContactList = ({ contacts, onEdit, onDelete, onFillForm, formatContactDisplay }: ContactListProps) => {
  // Fonction par défaut si aucune n'est fournie
  const defaultFormatContact = (contact: ContactEntry) => {
    return `${contact.firstName} ${contact.lastName}`;
  };

  const displayContact = formatContactDisplay || defaultFormatContact;

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <Card key={contact.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <UserCircle className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium">{displayContact(contact)}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {contact.email}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {contact.phone}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(contact)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => onDelete(contact.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {onFillForm && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onFillForm(contact)}
                  >
                    Utiliser
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContactList;
