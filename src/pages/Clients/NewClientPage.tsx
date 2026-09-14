import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "../../components/ui/PageHeader";
import { Input } from "../../components/ui/Input";
import { PhoneInput } from "../../components/ui/PhoneInput";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { newClientSchema, type NewClientSchema } from "../../utils/validators";
import { criarCliente } from "../../services/api.js";
import { useToastContext } from "../../lib/toastContext";

export function NewClientPage() {
  const navigate = useNavigate();
  const { addToast } = useToastContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NewClientSchema>({
    resolver: zodResolver(newClientSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const onSubmit = async (data: NewClientSchema) => {
    try {
      await criarCliente({
        nome: data.name.trim(),
        telefone: data.phone.trim(),
        endereco: data.address?.trim() || undefined,
      });
      addToast("Cliente cadastrado com sucesso!", "success");
      navigate("/clientes");
    } catch (err: any) {
      console.error("Erro ao cadastrar cliente:", err);
      addToast(
        err?.message || "Não foi possível cadastrar o cliente. Verifique a conexão com o servidor.",
        "error"
      );
    }
  };

  return (
    <div className="animate-fade-in max-w-lg">
      <PageHeader
        title="Novo cliente"
        breadcrumbs={[
          { label: "Clientes", href: "/clientes" },
          { label: "Novo cliente" },
        ]}
      />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            placeholder="Ex: Maria Oliveira"
            error={errors.name?.message}
            required
            {...register("name")}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                label="Telefone celular (WhatsApp)"
                required
                error={errors.phone?.message}
                value={field.value}
                onValueChange={(val) => field.onChange(val)}
                onBlur={field.onBlur}
              />
            )}
          />

          <Input
            label="Endereço residencial / comercial"
            placeholder="Rua, número, bairro ou referência"
            error={errors.address?.message}
            {...register("address")}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="notes">
              Observações ou preferências
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Ex: Prefere cabides próprios, não usar amaciante forte..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none transition-colors"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-red-500">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => navigate("/clientes")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" fullWidth loading={isSubmitting}>
              Cadastrar cliente
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
