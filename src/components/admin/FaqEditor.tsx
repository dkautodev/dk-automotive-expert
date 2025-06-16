
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useFaqItems, FaqItem } from '@/hooks/useFaqItems';
import { Plus, Edit, Trash2, GripVertical, Save, X } from 'lucide-react';

interface SortableFaqItemProps {
  item: FaqItem;
  isEditing: boolean;
  editValues: { question: string; answer: string };
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onEditChange: (field: 'question' | 'answer', value: string) => void;
}

const SortableFaqItem = ({ 
  item, 
  isEditing, 
  editValues, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete,
  onEditChange 
}: SortableFaqItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div 
          {...attributes} 
          {...listeners}
          className="mt-2 cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-5 h-5" />
        </div>
        
        <div className="flex-1 space-y-3">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label>Question</Label>
                <Input
                  value={editValues.question}
                  onChange={(e) => onEditChange('question', e.target.value)}
                  placeholder="Entrez la question..."
                />
              </div>
              <div>
                <Label>Réponse</Label>
                <Textarea
                  value={editValues.answer}
                  onChange={(e) => onEditChange('answer', e.target.value)}
                  placeholder="Entrez la réponse..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={onSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button size="sm" variant="outline" onClick={onCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <Label className="text-sm font-medium text-gray-600">Question:</Label>
                <p className="text-sm font-medium">{item.question}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Réponse:</Label>
                <p className="text-sm text-gray-700">{item.answer}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette FAQ ? Cette action ne peut pas être annulée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={onDelete}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FaqEditor = () => {
  const { faqItems, isLoading, createFaqItem, updateFaqItem, deleteFaqItem, reorderFaqItems } = useFaqItems();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ question: string; answer: string }>({
    question: '',
    answer: ''
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFaqValues, setNewFaqValues] = useState({ question: '', answer: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = faqItems.findIndex(item => item.id === active.id);
      const newIndex = faqItems.findIndex(item => item.id === over?.id);
      
      const reorderedItems = arrayMove(faqItems, oldIndex, newIndex);
      reorderFaqItems(reorderedItems);
    }
  };

  const handleEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setEditValues({
      question: item.question,
      answer: item.answer
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    const success = await updateFaqItem(editingId, {
      question: editValues.question,
      answer: editValues.answer
    });
    
    if (success) {
      setEditingId(null);
      setEditValues({ question: '', answer: '' });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({ question: '', answer: '' });
  };

  const handleDelete = async (id: string) => {
    await deleteFaqItem(id);
  };

  const handleAddFaq = async () => {
    if (!newFaqValues.question.trim() || !newFaqValues.answer.trim()) {
      return;
    }

    const success = await createFaqItem(newFaqValues.question, newFaqValues.answer);
    
    if (success) {
      setNewFaqValues({ question: '', answer: '' });
      setIsAddDialogOpen(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dk-navy mb-2">Gestion des FAQ</h1>
          <p className="text-gray-600">Gérez les questions fréquemment posées</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dk-navy hover:bg-dk-blue">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle FAQ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Question</Label>
                <Input
                  value={newFaqValues.question}
                  onChange={(e) => setNewFaqValues(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Entrez la question..."
                />
              </div>
              <div>
                <Label>Réponse</Label>
                <Textarea
                  value={newFaqValues.answer}
                  onChange={(e) => setNewFaqValues(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Entrez la réponse..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewFaqValues({ question: '', answer: '' });
                  }}
                >
                  Annuler
                </Button>
                <Button onClick={handleAddFaq}>
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Questions et Réponses</CardTitle>
          <p className="text-sm text-gray-600">
            Glissez-déposez les questions pour changer leur ordre d'affichage
          </p>
        </CardHeader>
        <CardContent>
          {faqItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune FAQ trouvée. Ajoutez-en une pour commencer.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={faqItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {faqItems.map((item) => (
                    <SortableFaqItem
                      key={item.id}
                      item={item}
                      isEditing={editingId === item.id}
                      editValues={editValues}
                      onEdit={() => handleEdit(item)}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onDelete={() => handleDelete(item.id)}
                      onEditChange={(field, value) => 
                        setEditValues(prev => ({ ...prev, [field]: value }))
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FaqEditor;
