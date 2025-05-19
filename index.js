// Variável global para armazenar os IDs dos inputs
let idsDosInputs = [];
let contadorInput = 1; // Contador para IDs dos inputs

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



// Função para exibir uma página específica

window.showPage = function (tabId, element) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

    const tabElement = document.getElementById(tabId);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    if (element) {
        element.classList.add('active');
    } else {
        ///Alertar no console.log === console.warn(`Elemento não encontrado para ativar a aba: ${tabId}`);
    }
}



// Função para gerar um código único
// Função para gerar um código único
// Função para gerar um código único
// Gerando um código único
/// index.js
import { database } from './firebase-config.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";


// Função para gerar um código único
function gerarCodigoUnico() {
    return 'xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
        (Math.random() * 16 | 0).toString(16)
    );
}




// Função para salvar no Firebase
// Função para salvar no Firebase
window.salvarDadosNoFirebase = function () {
    const codigoUnico = gerarCodigoUnico();
    const userId = codigoUnico;

    const dadosParaSalvar = {};

    // Título
    let tituloEnqueteSvl = document.getElementById("inputTitulo").value.trim();
    if (tituloEnqueteSvl === "") {
        tituloEnqueteSvl = "Título indefinido.";
    }

    dadosParaSalvar["Titulo"] = tituloEnqueteSvl;
    dadosParaSalvar["codigoConvite"] = codigoUnico;

    let todosPreenchidos = true;

    // Ordena corretamente para garantir que input01 venha como Opcao01
    const todosIds = [...idsDosInputs];

    // Garante que input01 venha primeiro mesmo que tenha sido adicionado depois
    if (!todosIds.includes("input01")) {
        todosIds.unshift("input01");
    } else {
        todosIds.splice(todosIds.indexOf("input01"), 1);
        todosIds.unshift("input01");
    }

    // Salvar cada input no formato: OpcaoXX: [valor, 0]
    todosIds.forEach((id, index) => {
        const input = document.getElementById(id);
        if (input && input.value.trim() !== "") {
            const valorInput = input.value.trim();
            const chave = `Opcao${(index + 1).toString().padStart(2, '0')}`;
            dadosParaSalvar[chave] = [valorInput, 0];
        } else {
            todosPreenchidos = false;
        }
    });

    if (!todosPreenchidos) {
        alert("Preencha todos os campos antes de salvar.");
        return;
    }

    const referencia = ref(database, `enquetes/${userId}`);

    set(referencia, dadosParaSalvar)
        .then(() => {
            const linkCompartilhamento = `${window.location.origin}/taskmateus/yourTask.html?ref=${codigoUnico}`;
            document.getElementById("linkCompartilhar").textContent = linkCompartilhamento;
            console.log("Link de convite:", linkCompartilhamento);
            showPage('tab2', this);
        })
        .catch((error) => {
            console.error("Erro ao salvar os dados: ", error.message);
        });
};










window.compartilharLink = function () {

    const paragrafo2 = document.getElementById("linkCompartilhar");
    const url = paragrafo2.textContent; // Agora sim, pegando o conteúdo do parágrafo

    if (url) {
        window.open(url, '_blank');
    } else {
        console.error("Nenhum link encontrado no parágrafo.");
    }
};

window.recarregarPagina = function () {
    window.location.reload();
};

