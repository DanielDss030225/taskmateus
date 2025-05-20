
import { database } from './firebase-config.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";



let idsDosInputs = [];
let contadorInput = 1;

function atualizarPlaceholders() {
    const inputs = document.querySelectorAll('#listaDeEnquetes input');
    inputs.forEach((input, index) => {
        if (input.id !== "input01") {
            const numero = (index + 1).toString().padStart(2, '0');
            input.placeholder = `Opção ${numero}`;
        }
    });
}

window.adicionarOpcoes = function () {
    let listaDeEnquetes = document.getElementById("listaDeEnquetes");

    if (listaDeEnquetes.children.length >= 30) {
        alert("Máximo de 30 opções atingido.");
        return;
    }

    let fundo = document.createElement("li");
    let inputTexto = document.createElement('input');
    let btnRemover = document.createElement('button');

    inputTexto.type = 'text';
    inputTexto.placeholder = `Opção ${listaDeEnquetes.children.length + 1}`;

    btnRemover.textContent = 'X';

    const idInput = `input-opcao-${contadorInput}`;
    contadorInput++;

    fundo.id = `li-opcao-${contadorInput}`; 
    inputTexto.id = idInput;              

    idsDosInputs.push(idInput);

    fundo.appendChild(inputTexto);
    fundo.appendChild(btnRemover);
    listaDeEnquetes.appendChild(fundo);

    btnRemover.addEventListener('click', () => {
        if (fundo.id !== "input01") {
            const index = idsDosInputs.indexOf(inputTexto.id);
            if (index > -1) {
                idsDosInputs.splice(index, 1); 
            }
            listaDeEnquetes.removeChild(fundo);
            atualizarPlaceholders();  

            console.log("Array de IDs após remoção:", idsDosInputs);
        }
    });

    console.log("Array de IDs após adição:", idsDosInputs);

    atualizarPlaceholders();
}

window.limpar = function () {
    const listaDeEnquetes = document.getElementById("listaDeEnquetes");

    const primeiroItem = document.getElementById("input01");
    listaDeEnquetes.innerHTML = ''; 

    if (primeiroItem) {
        listaDeEnquetes.appendChild(primeiroItem.closest('li'));
    }

    idsDosInputs = [primeiroItem.id];

    console.log("Array de IDs após limpar:", idsDosInputs);
}




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
    }
}



function gerarCodigoUnico() {
    return 'xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
        (Math.random() * 16 | 0).toString(16)
    );
}

window.salvarDadosNoFirebase = function () {
    const codigoUnico = gerarCodigoUnico();
    const userId = codigoUnico;

    const dadosParaSalvar = {};

    
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
            const linkCompartilhamento = `${window.location.origin}/taskmateuss/yourTask.html?ref=${codigoUnico}`;
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


 