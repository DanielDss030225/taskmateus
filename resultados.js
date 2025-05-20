
import { database } from './firebase-config.js';
import { ref, get, child, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";



let codigoSalvo = localStorage.getItem('codigo');
let juntar = "enquetes" + "/" + codigoSalvo

    console.log('Código salvo no localStorage:', codigoSalvo);

let rotulo = juntar;

const dbRef = ref(database);




mostrarSpinnerComAlerta()
function mostrarSpinnerComAlerta() {
  document.getElementById('spinnerAlerta').style.display = 'flex';
}

function esconderSpinnerComAlerta() {
  document.getElementById('spinnerAlerta').style.display = 'none';
}


let dadosGraficoCircular = [];
let dadosGraficoLinear = [];
function gerarGraficoCircular() {
  const canvas = document.getElementById('pieChart');
  if (!canvas) {
    console.warn('Canvas #pieChart não encontrado.');
    return;  // Interrompe a execução se o canvas não for encontrado
  }

  const ctx = canvas.getContext('2d');
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
          formatter: function(value) {
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
  const canvas = document.getElementById('barChart');
  if (!canvas) {
    console.warn('Canvas #barChart não encontrado.');
    return;  // Interrompe a execução se o canvas não for encontrado
  }

  const ctx = canvas.getContext('2d');
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
          formatter: function(value) {
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
 
esconderSpinnerComAlerta()
  } else {
    console.warn("Nenhum dado encontrado em:", rotulo);
  }
}).catch((error) => {
  
  console.error("Erro ao buscar dados:", error);
});


