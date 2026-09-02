import React, { useState } from "react";
import { Plus, Pencil, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { mockClothingTypes } from "../../mocks/clothingTypes";
import type { ClothingType } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import {
  profileSchema,
  clothingTypeSchema,
  type ProfileSchema,
  type ClothingTypeSchema,
} from "../../utils/validators";
import { useToastContext } from "../../lib/toastContext";

export function SettingsPage() {
  const { addToast } = useToastContext();
  const [clothingTypes, setClothingTypes] = useState<ClothingType[]>(mockClothingTypes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState("");
  const [newTypeModal, setNewTypeModal] = useState(false);

  const profileForm = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Administradora",
      email: "admin@passafacil.com.br",
    },
  });

  const newTypeForm = useForm<ClothingTypeSchema>({
    resolver: zodResolver(clothingTypeSchema),
    defaultValues: { name: "", pricePerUnit: 0 },
  });

  const onProfileSubmit = async (_data: ProfileSchema) => {
    await new Promise((r) => setTimeout(r, 500));
    addToast("Perfil atualizado com sucesso.", "success");
  };

  const startEdit = (ct: ClothingType) => {
    setEditingId(ct.id);
    setEditingPrice(ct.pricePerUnit.toFixed(2).replace(".", ","));
  };

  const saveEdit = (id: string) => {
    const parsed = parseFloat(editingPrice.replace(",", "."));
    if (!isNaN(parsed) && parsed > 0) {
      setClothingTypes((prev) =>
        prev.map((ct) => (ct.id === id ? { ...ct, pricePerUnit: parsed } : ct))
      );
      addToast("Preço atualizado.", "success");
    }
    setEditingId(null);
  };

  const onNewType = (data: ClothingTypeSchema) => {
    const newType: ClothingType = {
      id: `ct${Math.random().toString(36).slice(2, 9)}`,
      name: data.name,
      pricePerUnit: data.pricePerUnit,
      active: true,
    };
    setClothingTypes((prev) => [...prev, newType]);
    addToast("Tipo de roupa adicionado.", "success");
    setNewTypeModal(false);
    newTypeForm.reset();
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Configurações" />

      {/* Profile */}
      <Card className="mb-6">
        <p className="text-sm font-semibold text-slate-700 mb-4">Perfil</p>
        <form
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Nome"
            error={profileForm.formState.errors.name?.message}
            required
            {...profileForm.register("name")}
          />
          <Input
            label="Email"
            type="email"
            error={profileForm.formState.errors.email?.message}
            required
            {...profileForm.register("email")}
          />
          <Button
            type="submit"
            variant="secondary"
            loading={profileForm.formState.isSubmitting}
            className="self-start"
          >
            Salvar perfil
          </Button>
        </form>
      </Card>

      {/* Clothing types */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">Tipos de roupa</p>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setNewTypeModal(true)}
          >
            Novo tipo
          </Button>
        </div>

        <div className="flex flex-col divide-y divide-slate-50">
          {clothingTypes.map((ct) => (
            <div
              key={ct.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <span className="text-sm text-slate-800 font-medium">{ct.name}</span>
              {editingId === ct.id ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                      R$
                    </span>
                    <input
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(e.target.value)}
                      className="w-24 h-8 pl-7 pr-2 rounded-lg border border-indigo-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(ct.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => saveEdit(ct.id)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                    aria-label="Salvar"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                    aria-label="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 font-medium">
                    {formatCurrency(ct.pricePerUnit)}
                  </span>
                  <button
                    onClick={() => startEdit(ct)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    aria-label={`Editar preço de ${ct.name}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* New clothing type modal */}
      <Modal
        open={newTypeModal}
        onClose={() => { setNewTypeModal(false); newTypeForm.reset(); }}
        title="Novo tipo de roupa"
        size="sm"
      >
        <form
          onSubmit={newTypeForm.handleSubmit(onNewType)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Nome"
            placeholder="Ex: Paletó"
            error={newTypeForm.formState.errors.name?.message}
            required
            {...newTypeForm.register("name")}
          />
          <Input
            label="Preço por peça (R$)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            error={newTypeForm.formState.errors.pricePerUnit?.message}
            required
            {...newTypeForm.register("pricePerUnit", { valueAsNumber: true })}
          />
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => { setNewTypeModal(false); newTypeForm.reset(); }}
            >
              Cancelar
            </Button>
            <Button type="submit" fullWidth loading={newTypeForm.formState.isSubmitting}>
              Adicionar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
