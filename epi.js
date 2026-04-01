const CHAVE_FUNCIONARIOS = "epi_funcionarios";
const CHAVE_EPIS = "epi_itens";
const CHAVE_RETIRADAS = "epi_retiradas";

function obterFuncionarios() {
  return JSON.parse(localStorage.getItem(CHAVE_FUNCIONARIOS)) || [];
}

function salvarFuncionarios(lista) {
  localStorage.setItem(CHAVE_FUNCIONARIOS, JSON.stringify(lista));
}

function obterEpis() {
  return JSON.parse(localStorage.getItem(CHAVE_EPIS)) || [];
}

function salvarEpis(lista) {
  localStorage.setItem(CHAVE_EPIS, JSON.stringify(lista));
}

function obterRetiradas() {
  return JSON.parse(localStorage.getItem(CHAVE_RETIRADAS)) || [];
}

function salvarRetiradas(lista) {
  localStorage.setItem(CHAVE_RETIRADAS, JSON.stringify(lista));
}

function criarDadosIniciais() {
  if (!localStorage.getItem(CHAVE_FUNCIONARIOS)) {
    salvarFuncionarios([
      { id: 1, nome: "João Silva", cargo: "Operador", setor: "Produção", matricula: "1001" },
      { id: 2, nome: "Maria Souza", cargo: "Almoxarife", setor: "Estoque", matricula: "1002" }
    ]);
  }

  if (!localStorage.getItem(CHAVE_EPIS)) {
    salvarEpis([
      { id: 1, nome: "Capacete", categoria: "Proteção da cabeça", ca: "12345", estoque: 15, minimo: 5, validade: "2026-12-31" },
      { id: 2, nome: "Luva de Raspa", categoria: "Proteção das mãos", ca: "54321", estoque: 8, minimo: 4, validade: "2026-10-10" },
      { id: 3, nome: "Óculos de Proteção", categoria: "Proteção dos olhos", ca: "99887", estoque: 3, minimo: 5, validade: "2027-01-15" }
    ]);
  }

  if (!localStorage.getItem(CHAVE_RETIRADAS)) {
    salvarRetiradas([]);
  }
}

function formatarData(data) {
  if (!data) return "-";
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function obterStatusEpi(epi) {
  if (Number(epi.estoque) <= 0) {
    return { texto: "Sem estoque", classe: "status-danger" };
  }

  if (Number(epi.estoque) <= Number(epi.minimo)) {
    return { texto: "Estoque baixo", classe: "status-warning" };
  }

  return { texto: "Disponível", classe: "status-ok" };
}

function atualizarDashboard() {
  const funcionarios = obterFuncionarios();
  const epis = obterEpis();
  const retiradas = obterRetiradas();
  const estoqueBaixo = epis.filter(epi => Number(epi.estoque) <= Number(epi.minimo)).length;

  document.getElementById("totalFuncionarios").textContent = funcionarios.length;
  document.getElementById("totalEpis").textContent = epis.length;
  document.getElementById("totalRetiradas").textContent = retiradas.length;
  document.getElementById("totalEstoqueBaixo").textContent = estoqueBaixo;

  const dashboardFuncionarios = document.getElementById("dashboardFuncionarios");
  dashboardFuncionarios.innerHTML = "";
  funcionarios.slice(-5).reverse().forEach(funcionario => {
    dashboardFuncionarios.innerHTML += `
      <tr>
        <td>${funcionario.nome}</td>
        <td>${funcionario.cargo}</td>
        <td>${funcionario.setor}</td>
      </tr>
    `;
  });

  const dashboardRetiradas = document.getElementById("dashboardRetiradas");
  dashboardRetiradas.innerHTML = "";
  retiradas.slice(-5).reverse().forEach(retirada => {
    dashboardRetiradas.innerHTML += `
      <tr>
        <td>${retirada.funcionarioNome}</td>
        <td>${retirada.epiNome}</td>
        <td>${formatarData(retirada.data)}</td>
      </tr>
    `;
  });
}

function renderFuncionarios() {
  const tbody = document.getElementById("tabelaFuncionarios");
  const funcionarios = obterFuncionarios();
  tbody.innerHTML = "";

  funcionarios.forEach(funcionario => {
    tbody.innerHTML += `
      <tr>
        <td>${funcionario.nome}</td>
        <td>${funcionario.cargo}</td>
        <td>${funcionario.setor}</td>
        <td>${funcionario.matricula}</td>
        <td>
          <button class="btn-acao btn-editar" onclick="editarFuncionario(${funcionario.id})">Editar</button>
          <button class="btn-acao btn-excluir" onclick="excluirFuncionario(${funcionario.id})">Excluir</button>
        </td>
      </tr>
    `;
  });

  atualizarSelects();
}

function renderEpis() {
  const tbody = document.getElementById("tabelaEpis");
  const epis = obterEpis();
  tbody.innerHTML = "";

  epis.forEach(epi => {
    const status = obterStatusEpi(epi);
    tbody.innerHTML += `
      <tr>
        <td>${epi.nome}</td>
        <td>${epi.categoria}</td>
        <td>${epi.ca}</td>
        <td>${epi.estoque}</td>
        <td>${formatarData(epi.validade)}</td>
        <td><span class="status ${status.classe}">${status.texto}</span></td>
        <td>
          <button class="btn-acao btn-editar" onclick="editarEpi(${epi.id})">Editar</button>
          <button class="btn-acao btn-excluir" onclick="excluirEpi(${epi.id})">Excluir</button>
        </td>
      </tr>
    `;
  });

  atualizarSelects();
}

function renderRetiradas() {
  const tbody = document.getElementById("tabelaRetiradas");
  const retiradas = obterRetiradas().slice().reverse();
  tbody.innerHTML = "";

  retiradas.forEach(retirada => {
    tbody.innerHTML += `
      <tr>
        <td>${retirada.funcionarioNome}</td>
        <td>${retirada.epiNome}</td>
        <td>${retirada.quantidade}</td>
        <td>${formatarData(retirada.data)}</td>
        <td>${retirada.responsavel}</td>
        <td>${retirada.assinatura}</td>
        <td>${retirada.observacao || "-"}</td>
      </tr>
    `;
  });
}

function atualizarSelects() {
  const selectFuncionario = document.getElementById("retiradaFuncionario");
  const selectEpi = document.getElementById("retiradaEpi");

  selectFuncionario.innerHTML = `<option value="">Selecione</option>`;
  selectEpi.innerHTML = `<option value="">Selecione</option>`;

  obterFuncionarios().forEach(funcionario => {
    selectFuncionario.innerHTML += `<option value="${funcionario.id}">${funcionario.nome} - ${funcionario.setor}</option>`;
  });

  obterEpis().forEach(epi => {
    selectEpi.innerHTML += `<option value="${epi.id}">${epi.nome} - estoque: ${epi.estoque}</option>`;
  });
}

function editarFuncionario(id) {
  const funcionario = obterFuncionarios().find(item => item.id === id);
  if (!funcionario) return;

  document.getElementById("funcionarioIdEdicao").value = funcionario.id;
  document.getElementById("nomeFuncionario").value = funcionario.nome;
  document.getElementById("cargoFuncionario").value = funcionario.cargo;
  document.getElementById("setorFuncionario").value = funcionario.setor;
  document.getElementById("matriculaFuncionario").value = funcionario.matricula;

  mostrarSecao("funcionarios");
}

function excluirFuncionario(id) {
  if (!confirm("Deseja excluir este funcionário?")) return;

  const lista = obterFuncionarios().filter(item => item.id !== id);
  salvarFuncionarios(lista);
  atualizarTudo();
}

function editarEpi(id) {
  const epi = obterEpis().find(item => item.id === id);
  if (!epi) return;

  document.getElementById("epiIdEdicao").value = epi.id;
  document.getElementById("nomeEpi").value = epi.nome;
  document.getElementById("categoriaEpi").value = epi.categoria;
  document.getElementById("caEpi").value = epi.ca;
  document.getElementById("estoqueEpi").value = epi.estoque;
  document.getElementById("minimoEpi").value = epi.minimo;
  document.getElementById("validadeEpi").value = epi.validade || "";

  mostrarSecao("epis");
}

function excluirEpi(id) {
  if (!confirm("Deseja excluir este EPI?")) return;

  const lista = obterEpis().filter(item => item.id !== id);
  salvarEpis(lista);
  atualizarTudo();
}

function mostrarSecao(secao) {
  document.querySelectorAll(".section-content").forEach(item => {
    item.classList.remove("active-section");
  });

  document.querySelectorAll(".menu-link").forEach(item => {
    item.classList.remove("active");
  });

  document.getElementById(`sec-${secao}`).classList.add("active-section");
  document.querySelector(`.menu-link[data-section="${secao}"]`).classList.add("active");

  const titulos = {
    dashboard: ["Controle de EPI", "Gerencie funcionários, EPIs e fichas de retirada."],
    funcionarios: ["Funcionários", "Cadastre e controle os colaboradores."],
    epis: ["EPIs", "Cadastre e controle os itens entregues."],
    retiradas: ["Ficha de retirada", "Registre a entrega de EPIs e objetos."],
    historico: ["Histórico", "Acompanhe todas as retiradas registradas."]
  };

  document.getElementById("tituloSecao").textContent = titulos[secao][0];
  document.getElementById("subtituloSecao").textContent = titulos[secao][1];
}

function atualizarTudo() {
  atualizarDashboard();
  renderFuncionarios();
  renderEpis();
  renderRetiradas();
}

document.getElementById("formFuncionario").addEventListener("submit", function (e) {
  e.preventDefault();

  const idEdicao = document.getElementById("funcionarioIdEdicao").value;
  const nome = document.getElementById("nomeFuncionario").value;
  const cargo = document.getElementById("cargoFuncionario").value;
  const setor = document.getElementById("setorFuncionario").value;
  const matricula = document.getElementById("matriculaFuncionario").value;

  let lista = obterFuncionarios();

  if (idEdicao) {
    lista = lista.map(item =>
      item.id === Number(idEdicao) ? { ...item, nome, cargo, setor, matricula } : item
    );
    document.getElementById("mensagemFuncionario").textContent = "Funcionário atualizado com sucesso!";
  } else {
    lista.push({
      id: lista.length ? Math.max(...lista.map(item => item.id)) + 1 : 1,
      nome,
      cargo,
      setor,
      matricula
    });
    document.getElementById("mensagemFuncionario").textContent = "Funcionário cadastrado com sucesso!";
  }

  salvarFuncionarios(lista);
  this.reset();
  document.getElementById("funcionarioIdEdicao").value = "";
  atualizarTudo();
});

document.getElementById("cancelarFuncionario").addEventListener("click", function () {
  document.getElementById("formFuncionario").reset();
  document.getElementById("funcionarioIdEdicao").value = "";
  document.getElementById("mensagemFuncionario").textContent = "";
});

document.getElementById("formEpi").addEventListener("submit", function (e) {
  e.preventDefault();

  const idEdicao = document.getElementById("epiIdEdicao").value;
  const nome = document.getElementById("nomeEpi").value;
  const categoria = document.getElementById("categoriaEpi").value;
  const ca = document.getElementById("caEpi").value;
  const estoque = Number(document.getElementById("estoqueEpi").value);
  const minimo = Number(document.getElementById("minimoEpi").value);
  const validade = document.getElementById("validadeEpi").value;

  let lista = obterEpis();

  if (idEdicao) {
    lista = lista.map(item =>
      item.id === Number(idEdicao) ? { ...item, nome, categoria, ca, estoque, minimo, validade } : item
    );
    document.getElementById("mensagemEpi").textContent = "EPI atualizado com sucesso!";
  } else {
    lista.push({
      id: lista.length ? Math.max(...lista.map(item => item.id)) + 1 : 1,
      nome,
      categoria,
      ca,
      estoque,
      minimo,
      validade
    });
    document.getElementById("mensagemEpi").textContent = "EPI cadastrado com sucesso!";
  }

  salvarEpis(lista);
  this.reset();
  document.getElementById("epiIdEdicao").value = "";
  atualizarTudo();
});

document.getElementById("cancelarEpi").addEventListener("click", function () {
  document.getElementById("formEpi").reset();
  document.getElementById("epiIdEdicao").value = "";
  document.getElementById("mensagemEpi").textContent = "";
});

document.getElementById("formRetirada").addEventListener("submit", function (e) {
  e.preventDefault();

  const funcionarioId = Number(document.getElementById("retiradaFuncionario").value);
  const epiId = Number(document.getElementById("retiradaEpi").value);
  const quantidade = Number(document.getElementById("quantidadeRetirada").value);
  const data = document.getElementById("dataRetirada").value;
  const responsavel = document.getElementById("responsavelEntrega").value;
  const assinatura = document.getElementById("assinaturaRetirada").value;
  const observacao = document.getElementById("observacaoRetirada").value;

  const funcionario = obterFuncionarios().find(item => item.id === funcionarioId);
  const epi = obterEpis().find(item => item.id === epiId);

  if (!funcionario || !epi) return;

  if (quantidade > epi.estoque) {
    document.getElementById("mensagemRetirada").style.color = "#dc2626";
    document.getElementById("mensagemRetirada").textContent = "Quantidade maior que o estoque disponível.";
    return;
  }

  const retiradas = obterRetiradas();
  retiradas.push({
    funcionarioId,
    funcionarioNome: funcionario.nome,
    epiId,
    epiNome: epi.nome,
    quantidade,
    data,
    responsavel,
    assinatura,
    observacao
  });
  salvarRetiradas(retiradas);

  const epis = obterEpis().map(item =>
    item.id === epiId ? { ...item, estoque: item.estoque - quantidade } : item
  );
  salvarEpis(epis);

  document.getElementById("mensagemRetirada").style.color = "#15803d";
  document.getElementById("mensagemRetirada").textContent = "Retirada registrada com sucesso!";
  this.reset();
  atualizarTudo();
});

document.querySelectorAll(".menu-link").forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    mostrarSecao(this.dataset.section);
  });
});

criarDadosIniciais();
atualizarTudo();
mostrarSecao("dashboard");