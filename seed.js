import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const servicosIniciais = [
  { nome: "Camisa Social", preco: 8.00, unidade: "un" },
  { nome: "Calça Jeans / Sarja", preco: 7.00, unidade: "un" },
  { nome: "Camiseta Básica", preco: 5.00, unidade: "un" },
  { nome: "Vestido Simples", preco: 12.00, unidade: "un" },
  { nome: "Lençol / Cama", preco: 15.00, unidade: "un" },
];

async function main() {
  console.log("🌱 Iniciando o seed dos serviços...");

  for (const servico of servicosIniciais) {
    const existe = await prisma.servico.findFirst({
      where: { nome: { equals: servico.nome, mode: "insensitive" } },
    });

    if (!existe) {
      const criado = await prisma.servico.create({
        data: servico,
      });
      console.log(`✅ Criado: ${criado.nome} - R$ ${criado.preco.toFixed(2)} (${criado.unidade})`);
    } else {
      const atualizado = await prisma.servico.update({
        where: { id: existe.id },
        data: { preco: servico.preco, unidade: servico.unidade },
      });
      console.log(`ℹ️ Atualizado: ${atualizado.nome} - R$ ${atualizado.preco.toFixed(2)} (${atualizado.unidade})`);
    }
  }

  console.log("✨ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
