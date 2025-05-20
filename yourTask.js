
import { update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { database } from './firebase-config.js';
import { ref, get, child, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

let codigoSalvo = localStorage.getItem('codigo');
let juntar = "enquetes" + "/" + codigoSalvo

    // Exibe o valor no console
    console.log('Código salvo no localStorage:', codigoSalvo);













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



let ultimoSelecionado = null; 

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

    let fundo = document.createElement("li");
    let inputRadio = document.createElement("input");
    let texto = document.createElement("h3");
    let texto02 = document.createElement("h3");

       document.getElementById("containerTask").style.display = "block";
   


    const textoId = `${chave}_texto`;
    const texto02Id = `${chave}_votos`;

    texto.textContent = valor[0];         
    texto02.textContent = valor[1];       

    texto.id = textoId;
    texto02.id = texto02Id;

    inputRadio.id = chave;
    inputRadio.type = 'radio';
    inputRadio.name = name || "grupo-enquete";
    inputRadio.value = valor[0];
    inputRadio.classList.add('radio-estilizado');

    texto.classList.add("textoDinamic");

    fundo.appendChild(texto);
    fundo.appendChild(texto02);
    fundo.appendChild(inputRadio);
    listaDeEnquetes.appendChild(fundo);

    fundo.addEventListener('click', () => {
      inputRadio.checked = true;
      inputRadio.dispatchEvent(new Event('change'));
    });
    
    inputRadio.addEventListener('change', function () {
      if (ultimoSelecionado === this) {
        console.log("Opção já selecionada. Nenhuma ação tomada.");
        return;
      }

      const destino = document.getElementById("opcaoEscolhida");
      if (this.checked && destino) {
        destino.textContent = valor[0];
      }

      if (ultimoSelecionado) {
        const idAnterior = `${ultimoSelecionado.id}_votos`;
        const votosAnterior = document.getElementById(idAnterior);
        if (votosAnterior) {
          let valorAntigo = parseInt(votosAnterior.textContent, 10) || 0;
          votosAnterior.textContent = Math.max(valorAntigo - 1, 0);
        }
      }

      const votosAtual = document.getElementById(texto02Id);
      if (votosAtual) {
        let votos = parseInt(votosAtual.textContent, 10) || 0;
        votosAtual.textContent = votos + 1;
      }

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
  return ip.replace(/\./g, '-');
}

async function verificarERegistrarVoto(rotulo) {
  const ip = await obterIP();
  const ipFormatado = formatarIP(ip);
  const ipRef = ref(database, `${rotulo}/votos/${ipFormatado}`); 

  const snapshot = await get(ipRef);
  if (snapshot.exists()) {
    alert("Você já está participando desta enquete.");
    return false; 
  } else {
    await set(ipRef, true);
    alert("Obrigado por votar!");
    return true; 
  }
}

window.salvarVotos = async function () {
  const listaDeEnquetes = document.getElementById("listaDeEnquetes");
  const filhos = listaDeEnquetes.querySelectorAll("li");

  let dadosAtualizados = {};

  filhos.forEach((li) => {
    const input = li.querySelector("input[type='radio']");
    const texto = li.querySelector("h3");
    const votos = li.querySelectorAll("h3")[1]; 

    if (input && texto && votos && input.checked) {
      const chave = input.id;
      const valorTexto = texto.textContent.trim();
      const valorVotos = parseInt(votos.textContent.trim(), 10) || 0;

      dadosAtualizados[chave] = [valorTexto, valorVotos];
    }
  });

  if (Object.keys(dadosAtualizados).length === 0) {
    alert("Por favor, selecione uma opção antes de votar.");
    return;
  }

  const ipPodeVotar = await verificarERegistrarVoto(rotulo);
  if (!ipPodeVotar) {
    return;
  }

  try {
    await update(ref(database, rotulo), dadosAtualizados);
    console.log("Votos salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar votos:", error);
    alert("Erro ao salvar votos. Verifique o console.");
  }
};



let dadosGraficoCircular = [];
let dadosGraficoLinear = [];

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
        borderWidth: 2
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
      indexAxis: 'y', 
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


get(child(dbRef, rotulo)).then((snapshot) => {
  if (snapshot.exists()) {
    const lista = snapshot.val();

    Object.entries(lista).forEach(([chave, valor]) => {
      if (Array.isArray(valor)) {
        const nome = valor[0];
        const votos = valor[1];

        dadosGraficoCircular.push({ nome, votos });
        dadosGraficoLinear.push({ nome, votos });
        console.log(nome);
        console.log(votos);
      }
    });

    gerarGraficoCircular();
    gerarGraficoLinear();
                document.getElementById("fundoGeral").style.display = "Block";
           

  } else {
    console.warn("Nenhum dado encontrado em:", rotulo);
  }
}).catch((error) => {
  
  console.error("Erro ao buscar dados:", error);
});


