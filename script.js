// Lista de serviços com duração em minutos
const servicos = {
  "Mão": 60,              // 1 hora
  "Pé": 60,               // 1 hora
  "Pé e Mão": 105,        // 1h45
  "Blindagem": 75,        // 1h15
  "Esmalte em Gel": 75,   // 1h15
  "SPA dos Pés": 40       // 40 minutos
};

// Carrega os agendamentos do localStorage
let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

// Gera todos os horários que precisam ser bloqueados com base na duração
function gerarHorariosBloqueados(horarioInicial, duracao) {
  const bloqueados = [];
  let [hora, minuto] = horarioInicial.split(":").map(Number);
  let totalMinutos = hora * 60 + minuto;
  const fimMinutos = totalMinutos + duracao;

  while (totalMinutos < fimMinutos) {
    const h = Math.floor(totalMinutos / 60).toString().padStart(2, "0");
    const m = (totalMinutos % 60).toString().padStart(2, "0");
    bloqueados.push(`${h}:${m}`);
    totalMinutos += 30; // Avança em blocos de 30 minutos
  }

  return bloqueados;
}

// Verifica se há conflito com horários já ocupados no mesmo dia
function temConflito(horariosNovos, dataSelecionada) {
  return agendamentos.some(ag => {
    return ag.data === dataSelecionada && ag.horariosBloqueados.some(h => horariosNovos.includes(h));
  });
}

// Salva o agendamento
function salvarAgendamento(nome, servico, horario, data) {
  const duracao = servicos[servico];
  const horariosBloqueados = gerarHorariosBloqueados(horario, duracao);

  if (temConflito(horariosBloqueados, data)) {
    alert("Esse horário está em conflito com outro agendamento.");
    return;
  }

  const novoAgendamento = {
    nome,
    servico,
    horario,
    data,
    horariosBloqueados
  };

  agendamentos.push(novoAgendamento);
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

  alert("Agendamento confirmado com sucesso!");
  window.location.href = "confirmacao.html"; // redireciona após salvar
}

// Quando a página carregar, conecta o formulário
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-agendamento");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome").value;
      const servico = document.getElementById("servico").value;
      const horario = document.getElementById("horario").value;
      const data = document.getElementById("data").value;

      if (!nome || !servico || !horario || !data) {
        alert("Preencha todos os campos!");
        return;
      }

      salvarAgendamento(nome, servico, horario, data);
    });
  }
});

