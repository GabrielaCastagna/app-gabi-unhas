let servicoSelecionado = "";
let horarioSelecionado = "";

function escolherServico(servico) {
  servicoSelecionado = servico;
  document.getElementById("servicos").style.display = "none";
  document.getElementById("horarios").style.display = "block";
}

function selecionarHorario(horario) {
  horarioSelecionado = horario;

  const nomeCliente = document.getElementById("nomeCliente").value.trim();
  const dataAgendamento = document.getElementById("dataAgendamento").value;

  if (!nomeCliente || !dataAgendamento) {
    alert("Por favor, preencha seu nome e escolha a data.");
    return;
  }

  const agendamento = {
    nome: nomeCliente,
    servico: servicoSelecionado,
    data: dataAgendamento,
    horario: horarioSelecionado,
  };

  // Salvar no localStorage
  let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  agendamentos.push(agendamento);
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

  // Mostrar confirmação
  const resumo = `
    <strong>Nome:</strong> ${agendamento.nome}<br>
    <strong>Serviço:</strong> ${agendamento.servico}<br>
    <strong>Data:</strong> ${agendamento.data}<br>
    <strong>Horário:</strong> ${agendamento.horario}
  `;
  document.getElementById("resumo").innerHTML = resumo;

  document.getElementById("horarios").style.display = "none";
  document.getElementById("confirmacao").style.display = "block";
}

// Bloquear datas passadas e dias de folga
window.addEventListener("DOMContentLoaded", function () {
  const campoData = document.getElementById("dataAgendamento");

  // Define a data mínima como hoje
  const hoje = new Date().toISOString().split("T")[0];
  campoData.setAttribute("min", hoje);

  // Quando a cliente escolher uma data, bloqueia se for dia de folga
  campoData.addEventListener("input", function () {
    const dataSelecionada = new Date(this.value);
    const diaSemana = dataSelecionada.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

    // Lista de dias bloqueados: Domingo (0) e Segunda (1)
    const diasDeFolga = [0, 1];

    if (diasDeFolga.includes(diaSemana)) {
      alert("Neste dia você está de folga. Por favor, escolha outro dia.");
      this.value = ""; // Limpa a data
    }
  });
});
