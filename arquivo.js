const diasFolgaKey = 'diasFolga';
const agendamentosKey = 'agendamentos';

const duracoes = {
  "Mão": 60,
  "Pé": 60,
  "Pé + Mão": 120,
  "Esmalte em Gel": 90,
  "Blindagem": 90,
  "Spa dos Pés": 60
};

function carregarFolgas() {
  const folgas = localStorage.getItem(diasFolgaKey);
  return folgas ? JSON.parse(folgas) : [];
}

function salvarFolgas(folgas) {
  localStorage.setItem(diasFolgaKey, JSON.stringify(folgas));
}

function adicionarFolga(data) {
  let folgas = carregarFolgas();
  if (!folgas.includes(data)) {
    folgas.push(data);
    salvarFolgas(folgas);
    alert(`Folga adicionada para o dia ${data}`);
  } else {
    alert('Esse dia já está marcado como folga.');
  }
  atualizarCalendario();
}

function carregarAgendamentos() {
  const agendamentos = localStorage.getItem(agendamentosKey);
  return agendamentos ? JSON.parse(agendamentos) : [];
}

function salvarAgendamentos(agendamentos) {
  localStorage.setItem(agendamentosKey, JSON.stringify(agendamentos));
}

// Converter "HH:MM" em minutos do dia
function horaParaMinutos(horaStr) {
  const [h, m] = horaStr.split(':').map(Number);
  return h * 60 + m;
}

// Verifica conflito de horários considerando duração
function conflitoDeHorario(novoAgendamento, agendamentos) {
  const duracao = duracoes[novoAgendamento.servico];
  const inicioNovo = horaParaMinutos(novoAgendamento.hora);
  const fimNovo = inicioNovo + duracao;

  for (const a of agendamentos) {
    if (a.data !== novoAgendamento.data) continue;

    const duracaoExistente = duracoes[a.servico];
    const inicioExistente = horaParaMinutos(a.hora);
    const fimExistente = inicioExistente + duracaoExistente;

    if (inicioNovo < fimExistente && fimNovo > inicioExistente) {
      return true;
    }
  }
  return false;
}

function adicionarAgendamento(agendamento) {
  let agendamentos = carregarAgendamentos();
  let folgas = carregarFolgas();

  if (folgas.includes(agendamento.data)) {
    alert('Não é possível agendar neste dia, pois é folga.');
    return false;
  }

  if (conflitoDeHorario(agendamento, agendamentos)) {
    alert('Horário conflita com outro agendamento.');
    return false;
  }

  agendamentos.push(agendamento);
  salvarAgendamentos(agendamentos);
  alert('Agendamento confirmado!');
  atualizarListaAgendamentos();
  return true;
}

function atualizarListaAgendamentos() {
  const lista = document.getElementById('lista-agendamentos');
  if (!lista) return;

  const agendamentos = carregarAgendamentos();
  lista.innerHTML = '';

  if (agendamentos.length === 0) {
    lista.innerHTML = '<li>Não há agendamentos.</li>';
    return;
  }

  agendamentos.forEach(a => {
    const item = document.createElement('li');
    item.textContent = `${a.nome} - ${a.servico} - ${a.data} às ${a.hora}`;
    lista.appendChild(item);
  });
}

function atualizarCalendario() {
  const calendario = document.getElementById('calendario');
  if (!calendario) return;

  calendari
