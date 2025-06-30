const servicos = {
  "Mão": 60,
  "Pé": 60,
  "Pé e Mão": 105,
  "Blindagem": 75,
  "Esmalte em Gel": 75,
  "SPA dos Pés": 40
};

let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

// Defina as datas de folga aqui no formato "YYYY-MM-DD"
const diasDeFolga = ["2025-07-04", "2025-07-10", "2025-07-15"];

// Inicializa o flatpickr no input data, bloqueando as folgas
flatpickr("#data", {
  dateFormat: "Y-m-d",
  disable: diasDeFolga,
  minDate: "today"
});

function gerarHorariosBloqueados(horarioInicial, duracao) {
  const bloqueados = [];
  let [hora, minuto] = horarioInicial.split(":").map(Number);
  let totalMinutos = hora * 60 + minuto;
  const fimMinutos = totalMinutos + duracao;

  while (totalMinutos < fimMinutos) {
    const h = Math.floor(totalMinutos / 60).toString().padStart(2, "0");
    const m = (totalMinutos % 60).toString().padStart(2, "0");
    bloqueados.push(`${h}:${m}`);
    totalMinutos += 30;
  }

  return bloqueados;
}

function temConflito(horariosNovos, dataSelecionada) {
  return agendamentos.some(ag => {
    return ag.data === dataSelecionada && ag.horariosBloqueados.some(h => horariosNovos.includes(h));
  });
}

function salvarAgendamento(nome, servico, horario, data) {
  if (diasDeFolga.includes(data)) {
    alert("Neste dia estou de folga, por favor escolha outra data.");
    return;
  }

  const duracao = servicos[servico];
  const horariosBloqueados = gerarHorariosBloqueados(horario, duracao);

  if (temConflito(horariosBloqueados, data)) {
    alert("Esse horário está em conflito com outro agendamento.");
    return;
  }

  const novoAgendamento = { nome, servico, horario, data, horariosBloqueados };
  agendamentos.push(novoAgendamento);
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

  alert("Agendamento confirmado com sucesso!");
  window.location.href = "confirmacao.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-agendamento");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const servico = document.getElementById("servico").value;
    const horario = document.getElementById("horario").value;
    const data = document.getElementById("data").value;

    if (!nome || !servico || !horario || !data) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    salvarAgendamento(nome, servico, horario, data);
  });
});
