import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Card } from "../../components/ui/Card";
import { newServiceSchema, type NewServiceSchema } from "../../utils/validators";
import { clientService } from "../../services/clientService";
import { serviceService } from "../../services/serviceService";
import { mockClothingTypes } from "../../mocks/clothingTypes";
import type { Client } from "../../types";
import { formatCurrency, todayISO } from "../../utils/formatters";
import { useToastContext } from "../../lib/toastContext";

export function NewServicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToastContext();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    clientService.getAll().then(setClients);
  }, []);

  const today = todayISO();
  const defaultClientId = searchParams.get("clientId") ?? "";

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewServiceSchema>({
    resolver: zodResolver(newServiceSchema),
    defaultValues: {
      clientId: defaultClientId,
      receivedAt: today,
      expectedDeliveryAt: "",
      notes: "",
      items: [
        {
          clothingTypeId: "",
          clothingTypeName: "",
          quantity: 1,
          pricePerUnit: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  const total = watchedItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.pricePerUnit || 0),
    0
  );

  const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }));
  const clothingOptions = mockClothingTypes.map((ct) => ({
    value: ct.id,
    label: `${ct.name} — ${formatCurrency(ct.pricePerUnit)}`,
  }));

  const handleClothingTypeChange = (index: number, clothingTypeId: string) => {
    const found = mockClothingTypes.find((ct) => ct.id === clothingTypeId);
    if (found) {
      setValue(`items.${index}.clothingTypeId`, found.id);
      setValue(`items.${index}.clothingTypeName`, found.name);
      setValue(`items.${index}.pricePerUnit`, found.pricePerUnit);
    }
  };

  const onSubmit = async (data: NewServiceSchema) => {
    try {
      const client = clients.find((c) => c.id === data.clientId);
      if (!client) throw new Error("Cliente não encontrado");
      const service = await serviceService.create(
        data,
        client.name,
        client.phone
      );
      addToast("Serviço registrado com sucesso.", "success");
      navigate(`/servicos/${service.id}`);
    } catch {
      addToast("Erro ao registrar serviço.", "error");
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader
        title="Novo serviço"
        breadcrumbs={[
          { label: "Serviços", href: "/servicos" },
          { label: "Novo serviço" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* Step 1 - Client */}
        <Card>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            1. Cliente
          </p>
          <Controller
            control={control}
            name="clientId"
            render={({ field }) => (
              <Select
                label="Cliente"
                options={clientOptions}
                placeholder="Selecionar cliente..."
                error={errors.clientId?.message}
                required
                {...field}
              />
            )}
          />
        </Card>

        {/* Step 2 - Dates */}
        <Card>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            2. Informações
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Data de recebimento"
              type="date"
              error={errors.receivedAt?.message}
              required
              {...register("receivedAt")}
            />
            <Input
              label="Data prevista de entrega"
              type="date"
              error={errors.expectedDeliveryAt?.message}
              required
              {...register("expectedDeliveryAt")}
            />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Observações
            </label>
            <textarea
              rows={2}
              placeholder="Cuidados especiais, preferências..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none transition-colors"
              {...register("notes")}
            />
          </div>
        </Card>

        {/* Step 3 - Items */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              3. Peças
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() =>
                append({
                  clothingTypeId: "",
                  clothingTypeName: "",
                  quantity: 1,
                  pricePerUnit: 0,
                })
              }
            >
              Adicionar peça
            </Button>
          </div>

          {errors.items && !Array.isArray(errors.items) && (
            <p className="text-xs text-red-500 mb-3">{errors.items.message}</p>
          )}

          <div className="flex flex-col gap-3">
            {fields.map((field, index) => {
              const item = watchedItems[index];
              const subtotal = (item?.quantity || 0) * (item?.pricePerUnit || 0);

              return (
                <div
                  key={field.id}
                  className="flex flex-col gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <Select
                        label="Tipo de roupa"
                        options={clothingOptions}
                        placeholder="Selecionar..."
                        error={errors.items?.[index]?.clothingTypeId?.message}
                        value={item?.clothingTypeId ?? ""}
                        onChange={(e) =>
                          handleClothingTypeChange(index, e.target.value)
                        }
                      />
                    </div>
                    <Input
                      label="Quantidade"
                      type="number"
                      min={1}
                      error={errors.items?.[index]?.quantity?.message}
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>
                        Preço unit.: {formatCurrency(item?.pricePerUnit || 0)}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-800">
                        Subtotal: {formatCurrency(subtotal)}
                      </span>
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Remover peça"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Summary */}
        <Card className="bg-indigo-50 border-indigo-100">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-3">
            Resumo
          </p>
          <div className="flex flex-col gap-1.5 mb-3">
            {watchedItems.map((item, i) => {
              const subtotal = (item?.quantity || 0) * (item?.pricePerUnit || 0);
              if (!item?.clothingTypeName || subtotal === 0) return null;
              return (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {item.quantity} × {item.clothingTypeName}
                  </span>
                  <span className="text-slate-700 font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-indigo-100 pt-3">
            <span className="text-sm font-semibold text-slate-700">Total</span>
            <span className="text-xl font-bold text-indigo-700">
              {formatCurrency(total)}
            </span>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={() => navigate("/servicos")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
            Registrar serviço
          </Button>
        </div>
      </form>
    </div>
  );
}
