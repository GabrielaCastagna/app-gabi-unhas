// --- Variáveis globais ---
const diasFolgaKey = 'diasFolga';
const agendamentosKey = 'agendamentos';

// --- Função para carregar folgas do localStorage ---
function carregarFolgas() {
  const folgas = localStorage.getItem(diasFolgaKey);
  return folgas ? JSON.parse(folgas) : [];
}

// --- Função para salvar folgas no localStorage ---
function salvarFolgas(folgas) {
  localStorage.setItem(diasFolgaKey, JSON.stringify(folgas));
}

// --- Função para adicionar folga ---
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

// --- Função para carregar agendamentos ---
function carregarAgendamentos() {
  const agendamentos = localStorage.getItem(agendamentosKey);
  return agendamentos ? JSON.parse(agendamentos) : [];
}

// --- Função para salvar agendamentos ---
function salvarAgendamentos(agendamentos) {
  localStorage.setItem(agendamentosKey, JSON.stringify(agendamentos));
}

// --- Função para adicionar agendamento ---
function adicionarAgendamento(agendamento) {
  let agendamentos = carregarAgendamentos();
  // Verifica se o dia não é folga
  let folgas = carregarFolgas();
  if (folgas.includes(agendamento.data)) {
    alert('Não é possível agendar neste dia, pois é folga.');
    return false;
  }
  // Verifica conflito de horário
  let conflito = agendamentos.some(a => a.data === agendamento.data && a.hora === agendamento.hora);
  if (conflito) {
    alert('Horário já está ocupado.');
    return false;
  }
  agendamentos.push(agendamento);
  salvarAgendamentos(agendamentos);
  alert('Agendamento confirmado!');
  atualizarListaAgendamentos();
  return true;
}

// --- Função para atualizar a lista de agendamentos na tela ---
function atualizarListaAgendamentos() {
  const lista = document.getElementById('lista-agendamentos');
  if (!lista) return;

  const agendamentos = carregarAgendamentos();
  lista.innerHTML = '';

  if (agendamentos.length === 0) {
    lista.innerHTML = '<p>Não há agendamentos.</p>';
    return;
  }

  agendamentos.forEach(a => {
    const item = document.createElement('li');
    item.textContent = `${a.nome} - ${a.servico} - ${a.data} às ${a.hora}`;
    lista.appendChild(item);
  });
}

// --- Função para atualizar o calendário e marcar folgas ---
function atualizarCalendario() {
  const calendario = document.getElementById('calendario');
  if (!calendario) return;

  // Exemplo simples: lista de próximos 30 dias
  calendario.innerHTML = '';
  const folgas = carregarFolgas();
  const hoje = new Date();

  for (let i = 0; i < 30; i++) {
    const dia = new Date();
    dia.setDate(hoje.getDate() + i);
    const diaStr = dia.toISOString().split('T')[0];

    const btn = document.createElement('button');
    btn.textContent = diaStr;
    btn.style.margin = '3px';

    if (folgas.includes(diaStr)) {
      btn.style.backgroundColor = '#f08080'; // vermelho claro para folga
      btn.disabled = true;
      btn.title = 'Folga';
    } else {
      btn.style.backgroundColor = '#90ee90'; // verde claro para disponível
      btn.disabled = false;
      btn.title = 'Disponível';
      btn.onclick = () => {
        if (confirm(`Deseja adicionar folga para o dia ${diaStr}?`)) {
          adicionarFolga(diaStr);
        }
      };
    }
    calendario.appendChild(btn);
  }
}

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
  atualizarCalendario();
  atualizarListaAgendamentos();

  // Exemplo: formulário simples para adicionar agendamento
  const form = document.getElementById('form-agendamento');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = form.elements['nome'].value.trim();
      const servico = form.elements['servico'].value;
      const data = form.elements['data'].value;
      const hora = form.elements['hora'].value;

      if (!nome || !data || !hora) {
        alert('Preencha todos os campos!');
        return;
      }

      const sucesso = adicionarAgendamento({ nome, servico, data, hora });
      if (sucesso) {
        form.reset();
      }
    });
  }
});
