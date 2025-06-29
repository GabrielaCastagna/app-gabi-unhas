function escolherServico(servico) {
  document.getElementById('servicos').style.display = 'none';
  document.getElementById('horarios').style.display = 'block';
  // Salva o serviço escolhido para confirmação depois
  sessionStorage.setItem('servicoEscolhido', servico);
}

function selecionarHorario(horario) {
  const nome = document.getElementById('nomeCliente').value.trim();
  if (!nome) {
    alert('Por favor, digite seu nome antes de escolher o horário.');
    return;
  }

  const servico = sessionStorage.getItem('servicoEscolhido');
  const resumo = `Cliente: ${nome} | Serviço: ${servico} | Horário: ${horario}`;

  // Mostrar confirmação
  document.getElementById('horarios').style.display = 'none';
  const confirmacao = document.getElementById('confirmacao');
  confirmacao.style.display = 'block';
  document.getElementById('resumo').innerText = resumo;

  // Salvar agendamento no localStorage
  let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
  agendamentos.push(resumo);
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

  // Atualizar lista de agendamentos na página
  atualizarListaAgendamentos();
}

function atualizarListaAgendamentos() {
  const itensAgendados = document.getElementById('itens-agendados');
  itensAgendados.innerHTML = '';
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
  agendamentos.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    itensAgendados.appendChild(li);
  });
}

function mostrarTodosAgendamentos() {
  document.getElementById('lista-agendamentos').style.display = 'none';
  document.getElementById('tela-agendamentos').style.display = 'block';

  const todosAgendamentos = document.getElementById('todos-agendamentos');
  todosAgendamentos.innerHTML = '';

  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
  agendamentos.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    todosAgendamentos.appendChild(li);
  });
}

function limparAgendamentos() {
  if (confirm('Tem certeza que deseja limpar todos os agendamentos?')) {
    localStorage.removeItem('agendamentos');
    atualizarListaAgendamentos();
    alert('Agendamentos limpos com sucesso!');
  }
}

function voltarParaInicio() {
  document.getElementById('tela-agendamentos').style.display = 'none';
  document.getElementById('lista-agendamentos').style.display = 'block';
  document.getElementById('servicos').style.display = 'block';
  document.getElementById('confirmacao').style.display = 'none';
  document.getElementById('horarios').style.display = 'none';
}

// Atualizar lista quando a página carregar
window.onload = function () {
  atualizarListaAgendamentos();
};
