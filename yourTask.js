
import { update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { database } from './firebase-config.js';
import { ref, get, child, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";


const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const BASE_URL = isLocalhost
  ? 'http://localhost/TAREFA%20DO%20MATEUS/yourTask.html'   
  : 'https://danieldss030225.github.io/taskmateus/yourTask.html'; 

const API_URL = BASE_URL + '/api';

console.log('API rodando em:', API_URL);


const params = new URLSearchParams(window.location.search);
const codigoConvite = params.get('ref');
if (codigoConvite) {
    
    localStorage.removeItem('codigo');
    
    localStorage.setItem('codigo', codigoConvite);



    window.location.href = BASE_URL ; // Substitua com o URL desejado
}

mostrarSpinnerComAlerta()
function mostrarSpinnerComAlerta() {
  document.getElementById('spinnerAlerta').style.display = 'flex';
}

function esconderSpinnerComAlerta() {
  document.getElementById('spinnerAlerta').style.display = 'none';
}


let codigoSalvo = localStorage.getItem('codigo');
let juntar = "enquetes" + "/" + codigoSalvo

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

  } 
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
esconderSpinnerComAlerta() 
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

    // Redireciona para resultados.html
    window.location.href = "resultados.html";
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





