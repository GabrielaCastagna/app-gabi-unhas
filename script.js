function escolherServico(servico) {
  document.getElementById('servicos').style.display = 'none';
  document.getElementById('horarios').style.display = 'block';
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

  document.getElementById('horarios').style.display = 'none';
  document.getElementById('confirmacao').style.display = 'block';
  document.getElementById('resumo').innerText = resumo;

  let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
  agendamentos.push(resumo);
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

