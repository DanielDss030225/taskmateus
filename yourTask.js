

  import { update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { database } from './firebase-config.js';
import { ref, get, child, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Variável global para armazenar os IDs dos inputs
let idsDosInputs = [];
let contadorInput = 1; // Contador para IDs dos inputs// Recupera o código armazenado no localStorage
let codigoSalvo = localStorage.getItem('codigo');
let juntar = "enquetes" + "/" + codigoSalvo

    // Exibe o valor no console
    console.log('Código salvo no localStorage:', codigoSalvo);


// Função para atualizar os placeholders após adicionar ou remover
function atualizarPlaceholders() {
    const inputs = document.querySelectorAll('#listaDeEnquetes input');
    inputs.forEach((input, index) => {
        if (input.id !== "input01") {
            const numero = (index + 1).toString().padStart(2, '0');
            input.placeholder = `Opção ${numero}`;
        }
    });
}


// Função para adicionar uma nova opção
window.adicionarOpcoes = function () {
    let listaDeEnquetes = document.getElementById("listaDeEnquetes");

    if (listaDeEnquetes.children.length >= 30) {
        alert("Máximo de 30 opções atingido.");
        return;
    }

    // Cria os elementos necessários
    let fundo = document.createElement("li");
    let inputTexto = document.createElement('input');
    let btnRemover = document.createElement('button');

    // Configurações do input
    inputTexto.type = 'text';
    inputTexto.placeholder = `Opção ${listaDeEnquetes.children.length + 1}`;

    // Configurações do botão
    btnRemover.textContent = 'X';

    // Gera um ID único para o input (diferente do <li>)
    const idInput = `input-opcao-${contadorInput}`;
    contadorInput++;

    // Define os IDs nos elementos
    fundo.id = `li-opcao-${contadorInput}`; // ID da LI é diferente
    inputTexto.id = idInput;               // ID do input é único e separado

    // Adicionando o ID do input ao array global
    idsDosInputs.push(idInput);

    // Adicionando os elementos no <li> e depois na lista
    fundo.appendChild(inputTexto);
    fundo.appendChild(btnRemover);
    listaDeEnquetes.appendChild(fundo);

    // Evento de clique para remover o <li>, exceto o primeiro item com id "input01"
    btnRemover.addEventListener('click', () => {
        if (fundo.id !== "input01") {
            // Remove o ID do array global antes de remover o elemento
            const index = idsDosInputs.indexOf(inputTexto.id);
            if (index > -1) {
                idsDosInputs.splice(index, 1); // Remove o ID do array
            }
            listaDeEnquetes.removeChild(fundo);
            atualizarPlaceholders();  // Atualiza os placeholders após remoção

            // Exibe o array atualizado no console
            console.log("Array de IDs após remoção:", idsDosInputs);
        }
    });

    // Exibe o array atualizado no console
    console.log("Array de IDs após adição:", idsDosInputs);

    // Atualiza os placeholders após adicionar um novo item
    atualizarPlaceholders();
}

// Função para limpar todos os itens, exceto o primeiro
window.limpar = function () {
    const listaDeEnquetes = document.getElementById("listaDeEnquetes");

    // Mantém o primeiro item com id "input01"
    const primeiroItem = document.getElementById("input01");
    listaDeEnquetes.innerHTML = ''; // Remove todos os itens

    // Reinsere o primeiro item
    if (primeiroItem) {
        listaDeEnquetes.appendChild(primeiroItem.closest('li'));
    }

    // Atualiza o array de IDs para manter apenas o primeiro item
    idsDosInputs = [primeiroItem.id];

    // Exibe o array atualizado no console
    console.log("Array de IDs após limpar:", idsDosInputs);
}









// Referência dinâmica (você pode alterar o valor dessa variável conforme necessário)
let rotulo = juntar;

const dbRef = ref(database);

get(child(dbRef, rotulo)).then((snapshot) => {
  if (snapshot.exists()) {
    const lista = snapshot.val();

    Object.entries(lista).forEach(([chave, valor]) => {
      console.log(`Item: ${chave}, Valor: ${valor}`);
      executarAcao(chave, valor);
    });

  } else {
    console.warn("Nenhum dado encontrado em:", rotulo);
  }
}).catch((error) => {
  console.error("Erro ao buscar dados:", error);
});



let ultimoSelecionado = null; // Armazena o último input selecionado

function executarAcao(chave, valor, name) {
  if (chave === "Titulo") {
    const tituloElement = document.getElementById("textoDaTarefa");
    if (tituloElement) {
      tituloElement.textContent = valor;
    }
  } else if (chave === "codigoConvite") {
    const conviteElement = document.getElementById("codigo");
    if (conviteElement) {
      conviteElement.textContent = valor;
    }
  } else if (Array.isArray(valor)) {
    let listaDeEnquetes = document.getElementById("listaDeEnquetes");

    // Cria elementos
    let fundo = document.createElement("li");
    let inputRadio = document.createElement("input");
    let texto = document.createElement("h3");
    let texto02 = document.createElement("h3");

    const textoId = `${chave}_texto`;
    const texto02Id = `${chave}_votos`;

    texto.textContent = valor[0];         // Nome da opção
    texto02.textContent = valor[1];       // Quantidade de votos

    texto.id = textoId;
    texto02.id = texto02Id;

    inputRadio.id = chave;
    inputRadio.type = 'radio';
    inputRadio.name = name || "grupo-enquete";
    inputRadio.value = valor[0]; // apenas o valor da opção
    inputRadio.classList.add('radio-estilizado');

    texto.classList.add("textoDinamic");

    fundo.appendChild(texto);
    fundo.appendChild(texto02);
    fundo.appendChild(inputRadio);
    listaDeEnquetes.appendChild(fundo);

    // Faz o clique no <li> selecionar o radio correspondente
    fundo.addEventListener('click', () => {
      inputRadio.checked = true;
      inputRadio.dispatchEvent(new Event('change'));
    });

    // Evento de mudança do input
    inputRadio.addEventListener('change', function () {
      // Impede votação duplicada na mesma opção
      if (ultimoSelecionado === this) {
        console.log("Opção já selecionada. Nenhuma ação tomada.");
        return;
      }

      const destino = document.getElementById("opcaoEscolhida");
      if (this.checked && destino) {
        destino.textContent = valor[0];
      }

      // Decrementa votos da opção anterior
      if (ultimoSelecionado) {
        const idAnterior = `${ultimoSelecionado.id}_votos`;
        const votosAnterior = document.getElementById(idAnterior);
        if (votosAnterior) {
          let valorAntigo = parseInt(votosAnterior.textContent, 10) || 0;
          votosAnterior.textContent = Math.max(valorAntigo - 1, 0);
        }
      }

      // Incrementa votos da opção atual
      const votosAtual = document.getElementById(texto02Id);
      if (votosAtual) {
        let votos = parseInt(votosAtual.textContent, 10) || 0;
        votosAtual.textContent = votos + 1;
      }

      // Atualiza o último selecionado
      ultimoSelecionado = this;
    });
  }
}



async function obterIP() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

function formatarIP(ip) {
  // Substitui os pontos por um caractere permitido, como hífen (-)
  return ip.replace(/\./g, '-');
}

async function verificarERegistrarVoto(rotulo) {
  const ip = await obterIP();
  const ipFormatado = formatarIP(ip); // Formatar IP para usar como caminho
  const ipRef = ref(database, `${rotulo}/votos/${ipFormatado}`); // Caminho seguro no Firebase

  // Verifica se o IP já votou
  const snapshot = await get(ipRef);
  if (snapshot.exists()) {
    alert("Você já está participando desta enquete.");
    return false; // Retorna false para indicar que o usuário já votou
  } else {
    // Se não houver registro, registrar o IP
    await set(ipRef, true);
    alert("Obrigado por votar!");
    return true; // Retorna true para indicar que o voto foi registrado
  }
}

window.salvarVotos = async function () {
  const listaDeEnquetes = document.getElementById("listaDeEnquetes");
  const filhos = listaDeEnquetes.querySelectorAll("li");

  let dadosAtualizados = {};

  filhos.forEach((li) => {
    const input = li.querySelector("input[type='radio']");
    const texto = li.querySelector("h3");
    const votos = li.querySelectorAll("h3")[1]; // segundo h3 = texto02

    if (input && texto && votos && input.checked) {
      const chave = input.id;
      const valorTexto = texto.textContent.trim();
      const valorVotos = parseInt(votos.textContent.trim(), 10) || 0;

      dadosAtualizados[chave] = [valorTexto, valorVotos];
    }
  });

  // Se o usuário não selecionou nenhuma opção, exibe um alerta
  if (Object.keys(dadosAtualizados).length === 0) {
    alert("Por favor, selecione uma opção antes de votar.");
    return;
  }

  // Verificar e registrar o IP antes de salvar os votos
  const ipPodeVotar = await verificarERegistrarVoto(rotulo);
  if (!ipPodeVotar) {
    return; // Se o usuário já votou, não salvar os votos
  }

  // Se a verificação do IP permitir, atualize os votos no Firebase
  try {
    await update(ref(database, rotulo), dadosAtualizados);
    console.log("Votos salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar votos:", error);
    alert("Erro ao salvar votos. Verifique o console.");
  }
};



// Variáveis para armazenar dados para os gráficos
let dadosGraficoCircular = [];
let dadosGraficoLinear = [];

// Função para gerar o gráfico circular (pie chart)
  function gerarGraficoCircular() {
  const ctx = document.getElementById('pieChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: dadosGraficoCircular.map(item => item.nome),
      datasets: [{
        label: 'Votos',
        data: dadosGraficoCircular.map(item => item.votos),
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFD700'],
        borderColor: '#fff',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((tooltipItem.raw / total) * 100);
              return `${tooltipItem.label}: ${tooltipItem.raw} votos (${percentage}%)`;
            }
          }
        },
        datalabels: {
          formatter: function(value, context) {
            // Mostra os votos diretamente nas fatias do gráfico
            return value + ' votos';
          },
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14
          }
        }
      }
    }
  });
}


// Função para gerar gráfico linear horizontal (bar chart)
        function gerarGraficoLinear() {
  const ctx = document.getElementById('barChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dadosGraficoLinear.map(item => item.nome),
      datasets: [{
        label: 'Votos',
        data: dadosGraficoLinear.map(item => item.votos),
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y', // Para gráfico horizontal
      plugins: {
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((tooltipItem.raw / total) * 100);
              return `${tooltipItem.label}: ${tooltipItem.raw} votos (${percentage}%)`;
            }
          }
        },
        datalabels: {
          anchor: 'end',
          align: 'end',
          formatter: function(value, context) {
            // Mostra os votos no final de cada barra
            return value + ' votos';
          },
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14
          }
        }
      }
    }
  });
}


// Função para obter dados do Firebase e gerar os gráficos

get(child(dbRef, rotulo)).then((snapshot) => {
  if (snapshot.exists()) {
    const lista = snapshot.val();

    // Processar os dados para os gráficos
    Object.entries(lista).forEach(([chave, valor]) => {
      if (Array.isArray(valor)) {
        // Adicionar os dados para o gráfico circular e linear
        const nome = valor[0];
        const votos = valor[1];

        dadosGraficoCircular.push({ nome, votos });
        dadosGraficoLinear.push({ nome, votos });
      }
    });

    // Gerar os gráficos
    gerarGraficoCircular();
    gerarGraficoLinear();

  } else {
    console.warn("Nenhum dado encontrado em:", rotulo);
  }
}).catch((error) => {
  console.error("Erro ao buscar dados:", error);
});

// Restante do seu código para manipulação da enquete, como salvar votos, etc.

