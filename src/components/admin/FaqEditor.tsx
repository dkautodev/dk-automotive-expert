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
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useFaqItems, FaqItem } from '@/hooks/useFaqItems';
import { Plus, Edit, Trash2, GripVertical, Save, Loader2 } from 'lucide-react';

interface SortableFaqItemProps {
  item: FaqItem;
  isEditing: boolean;
  editValues: { question: string; answer: string };
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onEditChange: (field: 'question' | 'answer', value: string) => void;
  isSaving: boolean;
}

const SortableFaqItem = ({ 
  item, 
  isEditing, 
  editValues, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete,
  onEditChange,
  isSaving
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
    <div ref={setNodeRef} style={style} className="border rounded-lg p-4 bg-background">
      <div className="flex items-start gap-3">
        <div 
          {...attributes} 
          {...listeners}
          className="mt-2 cursor-grab hover:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="w-5 h-5" />
        </div>
        
        <div className="flex-1 space-y-3">
          {isEditing ? (
            <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <Label className="text-sm">Question</Label>
                <Input
                  value={editValues.question}
                  onChange={(e) => onEditChange('question', e.target.value)}
                  placeholder="Entrez la question..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Réponse</Label>
                <Textarea
                  value={editValues.answer}
                  onChange={(e) => onEditChange('answer', e.target.value)}
                  placeholder="Entrez la réponse..."
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={onSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Sauvegarder
                </Button>
                <Button size="sm" variant="outline" onClick={onCancel}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{item.question}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.answer}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="ghost" onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette FAQ ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
  const [isSaving, setIsSaving] = useState(false);

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
    
    setIsSaving(true);
    const success = await updateFaqItem(editingId, {
      question: editValues.question,
      answer: editValues.answer
    });
    
    if (success) {
      setEditingId(null);
      setEditValues({ question: '', answer: '' });
    }
    setIsSaving(false);
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
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement des FAQ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-dk-navy mb-2">Gestion des FAQ</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les questions fréquemment posées. Glissez-déposez pour réordonner.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter
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
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Réponse</Label>
                <Textarea
                  value={newFaqValues.answer}
                  onChange={(e) => setNewFaqValues(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Entrez la réponse..."
                  rows={4}
                  className="mt-1"
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

      <Accordion type="multiple" defaultValue={['faq-items']} className="space-y-3">
        <AccordionItem value="faq-items" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-dk-navy" />
              <span className="font-semibold">Questions et Réponses ({faqItems.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            {faqItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune FAQ trouvée. Ajoutez-en une pour commencer.
              </p>
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
                        isSaving={isSaving}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FaqEditor;
