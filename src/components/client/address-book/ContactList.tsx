
import { ContactEntry } from '@/types/addressBook';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, UserCircle, Mail, Phone } from 'lucide-react';

interface ContactListProps {
  contacts: ContactEntry[];
  onEdit: (contact: ContactEntry) => void;
  onDelete: (id: string) => void;
  onFillForm?: (contact: ContactEntry) => void;
}

const ContactList = ({ contacts, onEdit, onDelete, onFillForm }: ContactListProps) => {
  const getBadgeVariant = (type: 'pickup' | 'delivery') => {
    return type === 'pickup' ? 'secondary' : 'default';
  };
  
  const getTypeLabel = (type: 'pickup' | 'delivery') => {
    return type === 'pickup' ? 'Ramassage' : 'Livraison';
  };

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
                  <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {contact.email}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {contact.phone}
                  </div>
                  <Badge variant={getBadgeVariant(contact.type)} className="mt-2">
                    {getTypeLabel(contact.type)}
                  </Badge>
                  {contact.notes && (
                    <p className="text-xs text-gray-500 mt-2 max-w-xs">{contact.notes}</p>
                  )}
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
