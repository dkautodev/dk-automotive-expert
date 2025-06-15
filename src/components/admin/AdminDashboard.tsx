
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PageContent = {
  id: string;
  page: string;
  block_key: string;
  content_type: string;
  content_value: string | null;
  description: string | null;
  updated_at: string | null;
};

export default function AdminDashboard() {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Récupère tous les contenus
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("page_contents").select("*").order("page");
      setContents(data ?? []);
    })();
  }, []);

  const handleEdit = (item: PageContent) => {
    setEditingId(item.id);
    setEditValue(item.content_value || "");
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    const { error } = await supabase.from("page_contents").update({ content_value: editValue, updated_at: new Date().toISOString() }).eq("id", id);
    if (!error) {
      setContents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content_value: editValue } : c))
      );
      setEditingId(null);
    }
    setSaving(false);
  };

  const filtered = contents.filter(
    (c) =>
      (c.page + " " + c.block_key + " " + (c.description || "")).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Admin — Gestion des contenus</h2>
      <Input className="mb-4" placeholder="Filtrer par page, bloc, description..." value={search} onChange={e=>setSearch(e.target.value)} />
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-secondary/20">
              <th className="py-2 px-4">Page</th>
              <th className="py-2 px-4">Bloc</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Valeur</th>
              <th className="py-2 px-4">Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.page}</td>
                <td className="border px-2 py-1">{item.block_key}</td>
                <td className="border px-2 py-1">{item.content_type}</td>
                <td className="border px-2 py-1">
                  {editingId === item.id ? (
                    <Input value={editValue} onChange={e=>setEditValue(e.target.value)} />
                  ) : (
                    <span className="whitespace-pre-wrap">{item.content_value ? item.content_value : <span className="text-gray-400 italic">vide</span>}</span>
                  )}
                </td>
                <td className="border px-2 py-1">{item.description}</td>
                <td className="border px-2 py-1 text-right">
                  {editingId === item.id ? (
                    <Button size="sm" onClick={()=>handleSave(item.id)} disabled={saving}>
                      {saving ? "Sauvegarde..." : "OK"}
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={()=>handleEdit(item)}>
                      Éditer
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">Aucun résultat.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
