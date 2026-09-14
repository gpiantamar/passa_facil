/**
 * Script de diagnóstico rápido da API Passa Fácil
 * Execute no terminal com: node test-api.js
 */
const API_URL = process.env.API_URL || "http://localhost:3333";

async function runDiagnostics() {
  console.log("==================================================");
  console.log("🔍 INICIANDO DIAGNÓSTICO DA API PASSA FÁCIL");
  console.log(`🌐 Alvo: ${API_URL}`);
  console.log("==================================================\n");

  let clienteCriadoId = null;
  let servicoCriadoId = null;
  let pedidoCriadoId = null;

  // 1. Health Check (Ping)
  console.log("1️⃣ Testando Health Check (GET /api/status)...");
  try {
    const resPing = await fetch(`${API_URL}/api/status`);
    const dataPing = await resPing.json();
    console.log(`   Status HTTP: ${resPing.status}`);
    console.log(`   Resposta:`, dataPing);
    if (resPing.ok && dataPing.ok) {
      console.log("   ✅ Ping respondeu com SUCESSO!\n");
    } else {
      console.log("   ⚠️ Ping retornou status não esperado.\n");
    }
  } catch (err) {
    console.error("   ❌ FALHA ao conectar ao endpoint /api/status:", err.message);
    console.error("   Certifique-se de que o servidor Node está rodando na porta 3333!\n");
    process.exit(1);
  }

  // 2. Teste GET /api/servicos
  console.log("2️⃣ Testando listagem de serviços (GET /api/servicos)...");
  try {
    const resServicos = await fetch(`${API_URL}/api/servicos`);
    const servicos = await resServicos.json();
    console.log(`   Status HTTP: ${resServicos.status}`);
    console.log(`   Quantidade de serviços cadastrados: ${Array.isArray(servicos) ? servicos.length : 0}`);
    if (Array.isArray(servicos) && servicos.length > 0) {
      servicoCriadoId = servicos[0].id;
      console.log(`   ✅ Serviços carregados com sucesso! Exemplo: [ID ${servicoCriadoId}] ${servicos[0].nome}`);
    } else {
      // Cria um serviço para teste
      console.log("   Criando serviço de teste...");
      const resNovoServico = await fetch(`${API_URL}/api/servicos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: "Camisa Social Teste", preco: "12.50", unidade: "un" }),
      });
      const novoServico = await resNovoServico.json();
      servicoCriadoId = novoServico.id;
      console.log(`   ✅ Serviço criado com sucesso: [ID ${servicoCriadoId}] ${novoServico.nome}`);
    }
    console.log("");
  } catch (err) {
    console.error("   ❌ Falha ao buscar serviços:", err.message, "\n");
  }

  // 3. Teste POST /api/clientes (Cadastro com sanitização)
  console.log("3️⃣ Testando criação de cliente (POST /api/clientes)...");
  try {
    const timestamp = Date.now().toString().slice(-4);
    const resCliente = await fetch(`${API_URL}/api/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: `Cliente Teste ${timestamp}`,
        telefone: "(11) 98765-4321",
        endereco: "Rua das Flores, 123",
      }),
    });
    const clienteData = await resCliente.json();
    console.log(`   Status HTTP: ${resCliente.status}`);
    console.log(`   Resposta:`, clienteData);
    if (resCliente.ok && clienteData.id) {
      clienteCriadoId = clienteData.id;
      console.log(`   ✅ Cliente criado com SUCESSO! ID: ${clienteCriadoId}\n`);
    } else {
      console.log(`   ❌ Erro ao criar cliente:`, clienteData, "\n");
    }
  } catch (err) {
    console.error("   ❌ Falha ao criar cliente:", err.message, "\n");
  }

  // 4. Teste POST /api/pedidos com envio de tipos numéricos e strings
  if (clienteCriadoId && servicoCriadoId) {
    console.log("4️⃣ Testando criação de pedido com conversão de tipos (POST /api/pedidos)...");
    try {
      // Simula envio vindo do front (mesmo com strings "1" para testar conversão parseInt/parseFloat)
      const pedidoPayload = {
        clienteId: String(clienteCriadoId), // enviando como string para validar blindagem
        status: "recebido",
        observacoes: "Teste automatizado de integração",
        itens: [
          {
            servicoId: String(servicoCriadoId),
            quantidade: "3", // string para testar conversão
            valorUnit: "15.00", // string para testar conversão
          },
        ],
      };

      const resPedido = await fetch(`${API_URL}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoPayload),
      });

      const pedidoData = await resPedido.json();
      console.log(`   Status HTTP: ${resPedido.status}`);
      console.log(`   Resposta:`, pedidoData);
      if (resPedido.ok && pedidoData.id) {
        pedidoCriadoId = pedidoData.id;
        console.log(`   ✅ Pedido #${pedidoCriadoId} criado com SUCESSO! Total calculado: R$ ${pedidoData.valorTotal}\n`);
      } else {
        console.log(`   ❌ Erro ao criar pedido:`, pedidoData, "\n");
      }
    } catch (err) {
      console.error("   ❌ Falha ao criar pedido:", err.message, "\n");
    }
  }

  // 5. Teste PATCH /api/pedidos/:id/status
  if (pedidoCriadoId) {
    console.log(`5️⃣ Testando atualização de status (PATCH /api/pedidos/${pedidoCriadoId}/status)...`);
    try {
      const resPatch = await fetch(`${API_URL}/api/pedidos/${pedidoCriadoId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "passando" }),
      });
      const patchData = await resPatch.json();
      console.log(`   Status HTTP: ${resPatch.status}`);
      console.log(`   Novo status: ${patchData.status}`);
      if (resPatch.ok && patchData.status === "passando") {
        console.log("   ✅ Atualização de status concluída com SUCESSO!\n");
      }
    } catch (err) {
      console.error("   ❌ Falha ao atualizar status do pedido:", err.message, "\n");
    }
  }

  console.log("==================================================");
  console.log("🏁 DIAGNÓSTICO CONCLUÍDO!");
  console.log("==================================================");
}

runDiagnostics();
