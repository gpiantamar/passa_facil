import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Plus, Trash2, AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/ui/Loading";
import { newServiceSchema, type NewServiceSchema } from "../../utils/validators";
import { getClientes, getServicos, criarPedido } from "../../services/api.js";
import { formatCurrency, todayISO } from "../../utils/formatters";
import { useToastContext } from "../../lib/toastContext";

interface ClienteItem {
  id: number;
  nome: string;
  telefone: string;
}

interface ServicoItem {
  id: number;
  nome: string;
  preco: number;
  unidade: string;
}

export function NewServicePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToastContext();

  const [clients, setClients] = useState<ClienteItem[]>([]);
  const [services, setServices] = useState<ServicoItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const today = todayISO();
  const defaultClientId = searchParams.get("clientId") ?? "";

  const loadInitialData = async () => {
    setLoadingData(true);
    setLoadError(null);
    try {
      const [cls, srvs] = await Promise.all([getClientes(), getServicos()]);
      setClients(cls || []);
      setServices(srvs || []);
    } catch (err: any) {
      console.error("Erro ao carregar dados iniciais:", err);
      setLoadError(
        err?.message ||
          "Não foi possível carregar clientes e serviços. Verifique se o servidor está rodando em http://localhost:3333."
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

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

  // Cálculo dinâmico do total e de peças
  const total = (watchedItems || []).reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0) * (Number(item?.pricePerUnit) || 0),
    0
  );

  const totalPieces = (watchedItems || []).reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0),
    0
  );

  const clientOptions = clients.map((c) => ({
    value: String(c.id),
    label: `${c.nome} (${c.telefone || "Sem telefone"})`,
  }));

  const serviceOptions = services.map((s) => ({
    value: String(s.id),
    label: `${s.nome} — ${formatCurrency(s.preco)} / ${s.unidade || "un"}`,
  }));

  const handleServiceChange = (index: number, servicoIdStr: string) => {
    const servicoId = parseInt(servicoIdStr, 10);
    const found = services.find((s) => s.id === servicoId);
    if (found) {
      setValue(`items.${index}.clothingTypeId`, String(found.id));
      setValue(`items.${index}.clothingTypeName`, found.nome);
      setValue(`items.${index}.pricePerUnit`, found.preco);
    }
  };

  const onSubmit = async (data: NewServiceSchema) => {
    try {
      const payload = {
        clienteId: parseInt(data.clientId, 10),
        observacoes: data.notes || undefined,
        previsaoPara: data.expectedDeliveryAt ? new Date(data.expectedDeliveryAt).toISOString() : undefined,
        status: "recebido",
        itens: data.items.map((item) => ({
          servicoId: parseInt(item.clothingTypeId, 10),
          quantidade: parseInt(String(item.quantity), 10),
          valorUnit: parseFloat(String(item.pricePerUnit)),
        })),
      };

      const novoPedido = await criarPedido(payload);
      addToast("Pedido registrado com sucesso!", "success");
      navigate(`/servicos/${novoPedido.id}`);
    } catch (err: any) {
      console.error("Erro ao criar pedido:", err);
      addToast(
        err?.message || "Erro ao registrar pedido no servidor. Tente novamente.",
        "error"
      );
    }
  };

  if (loadingData) {
    return (
      <div className="py-12">
        <Loading text="Carregando clientes e serviços disponíveis..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl w-full min-w-0">
      <PageHeader
        title="Novo Pedido / Serviço"
        breadcrumbs={[
          { label: "Serviços", href: "/servicos" },
          { label: "Novo serviço" },
        ]}
      />

      {loadError && (
        <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Falha na conexão com o servidor</p>
              <p className="text-xs text-red-700 mt-0.5">{loadError}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadInitialData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="border-red-200 hover:bg-red-100 text-red-800"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {services.length === 0 && !loadError && (
        <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 flex-1">
            <p className="font-semibold">Nenhum serviço / tipo de roupa cadastrado</p>
            <p className="mt-0.5 text-xs text-amber-700">
              Para adicionar itens ao pedido, execute o seed ou cadastre novos serviços nas configurações.
            </p>
            <Link
              to="/configuracoes"
              className="inline-block mt-2 text-xs font-semibold text-amber-900 underline hover:text-amber-950"
            >
              Ir para Configurações &rarr;
            </Link>
          </div>
        </div>
      )}

      {clients.length === 0 && !loadError && (
        <div className="mb-4 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 flex-1">
            <p className="font-semibold">Nenhum cliente cadastrado</p>
            <p className="mt-0.5 text-xs text-blue-700">
              Cadastre um cliente antes de registrar um novo pedido.
            </p>
            <Link
              to="/clientes/novo"
              className="inline-block mt-2 text-xs font-semibold text-blue-900 underline hover:text-blue-950"
            >
              Cadastrar cliente &rarr;
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        {/* Identificação do Cliente */}
        <Card>
          <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            Dados do Pedido
          </p>
          <div className="flex flex-col gap-4">
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Cliente"
                  options={clientOptions}
                  placeholder="Selecione o cliente..."
                  error={errors.clientId?.message}
                  required
                  {...field}
                />
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Data de recebimento"
                type="date"
                error={errors.receivedAt?.message}
                required
                {...register("receivedAt")}
              />
              <Input
                label="Previsão de entrega"
                type="date"
                error={errors.expectedDeliveryAt?.message}
                {...register("expectedDeliveryAt")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="notes">
                Observações
              </label>
              <textarea
                id="notes"
                rows={2}
                placeholder="Ex: Cuidado com botões delicados, amido suave..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none transition-colors"
                {...register("notes")}
              />
            </div>
          </div>
        </Card>

        {/* Itens do Pedido */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">Peças e Serviços</p>
              <p className="text-xs text-slate-400">Adicione os serviços incluídos neste pedido.</p>
            </div>
            <Button
              type="button"
              variant="outline"
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
              disabled={services.length === 0}
            >
              Adicionar item
            </Button>
          </div>

          {errors.items?.message && (
            <p className="text-xs text-red-500 mb-3">{errors.items.message}</p>
          )}

          <div className="flex flex-col gap-3">
            {fields.map((field, index) => {
              const itemQuantity = Number(watchedItems?.[index]?.quantity) || 0;
              const itemPrice = Number(watchedItems?.[index]?.pricePerUnit) || 0;
              const subtotal = itemQuantity * itemPrice;

              return (
                <div
                  key={field.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 transition-colors hover:border-slate-200"
                >
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs font-medium text-slate-600 block mb-1">
                      Serviço / Peça
                    </label>
                    <select
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-colors"
                      value={watchedItems?.[index]?.clothingTypeId || ""}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                    >
                      <option value="">Selecione o serviço...</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.items?.[index]?.clothingTypeId && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.items[index]?.clothingTypeId?.message}
                      </p>
                    )}
                  </div>

                  <div className="w-24 flex-shrink-0">
                    <Input
                      label="Qtd"
                      type="number"
                      min={1}
                      error={errors.items?.[index]?.quantity?.message}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </div>

                  <div className="w-28 flex-shrink-0">
                    <Input
                      label="Valor un."
                      type="number"
                      step="0.01"
                      min={0}
                      error={errors.items?.[index]?.pricePerUnit?.message}
                      {...register(`items.${index}.pricePerUnit`, { valueAsNumber: true })}
                    />
                  </div>

                  <div className="text-right sm:text-right min-w-[80px] pb-2 flex-shrink-0">
                    <p className="text-xs text-slate-400">Subtotal</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {formatCurrency(subtotal)}
                    </p>
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="h-10 px-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center flex-shrink-0"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Resumo Dinâmico do Pedido */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm text-slate-500">
              Total de itens: <strong className="text-slate-700 font-semibold">{totalPieces} peça(s)</strong>
            </span>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Valor Total Previsto</span>
              <span className="text-xl font-bold text-indigo-700">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </Card>

        {/* Botões de Ação */}
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
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            disabled={services.length === 0 || clients.length === 0}
          >
            Salvar Pedido
          </Button>
        </div>
      </form>
    </div>
  );
}
