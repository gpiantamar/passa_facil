import React, { useState, useEffect, useCallback } from "react";
import {
  Tag,
  Plus,
  Shirt,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
  DollarSign,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { EmptyState } from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/Loading";
import { getServicos, criarServico } from "../../services/api.js";
import { formatCurrency } from "../../utils/formatters";
import { useToastContext } from "../../lib/toastContext";

interface ServicoItem {
  id: string | number;
  nome: string;
  preco: number;
  unidade: string;
}

export function PriceTablePage() {
  const { addToast } = useToastContext();

  const [services, setServices] = useState<ServicoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal para adicionar nova peça / serviço
  const [modalOpen, setModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [unidade, setUnidade] = useState("un");
  const [saving, setSaving] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServicos();
      setServices(data || []);
    } catch (err: any) {
      console.error("Erro ao carregar serviços:", err);
      setError(
        err?.message ||
          "Não foi possível conectar à API de serviços. Verifique se o servidor está rodando em http://localhost:3333."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      addToast("O nome da peça é obrigatório.", "warning");
      return;
    }
    const precoNum = parseFloat(preco.replace(",", "."));
    if (isNaN(precoNum) || precoNum <= 0) {
      addToast("Informe um valor unitário válido e positivo.", "warning");
      return;
    }

    setSaving(true);
    try {
      await criarServico({
        nome: nome.trim(),
        preco: precoNum,
        unidade,
      });

      addToast(`Serviço "${nome.trim()}" cadastrado com sucesso!`, "success");
      setModalOpen(false);
      setNome("");
      setPreco("");
      setUnidade("un");
      fetchServices();
    } catch (err: any) {
      console.error("Erro ao cadastrar serviço:", err);
      addToast(err?.message || "Não foi possível cadastrar o serviço.", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-4">
      <PageHeader
        title="Tabela de Preços & Serviços"
        subtitle="Gerencie o catálogo de roupas e os valores unitários praticados na passadoria."
        actions={
          <Button
            onClick={() => setModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-bold shadow-xs shadow-indigo-200"
          >
            + Nova Peça / Serviço
          </Button>
        }
      />

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar peça no catálogo..."
          className="w-full h-10 pl-9 pr-3 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
        />
      </div>

      {/* Erro */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Falha na conexão com a API de serviços</p>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchServices}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="border-red-200 hover:bg-red-100 text-red-800"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={6} cols={3} />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="Nenhum serviço cadastrado."
          description={
            search
              ? `Nenhuma peça encontrada para "${search}".`
              : "Cadastre as peças que você passa (camisas, calças, vestidos) e seus valores."
          }
          action={
            !search ? (
              <Button onClick={() => setModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />} size="sm">
                Cadastrar primeira peça
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Peça / Serviço
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Unidade de Cobrança
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Valor Unitário
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-800 flex items-center gap-2.5">
                    <Shirt className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span>{service.nome}</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="font-semibold text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {service.unidade || "un"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-extrabold text-slate-900 text-base">
                    {formatCurrency(Number(service.preco) || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODAL DE NOVA PEÇA / SERVIÇO ──────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Adicionar Peça / Serviço ao Catálogo"
        size="md"
      >
        <form onSubmit={handleSaveService} className="flex flex-col gap-4">
          <Input
            label="Nome da peça / serviço *"
            placeholder="Ex: Camisa social de manga longa"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Valor unitário (R$) *"
              placeholder="Ex: 8.50"
              type="number"
              step="0.01"
              min="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Unidade de cobrança</label>
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              >
                <option value="un">Por Unidade (un)</option>
                <option value="kg">Por Quilo (kg)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Salvar Peça
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
