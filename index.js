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
function adicionarOpcoes() {
    let listaDeEnquetes = document.getElementById("listaDeEnquetes");

    if (listaDeEnquetes.children.length >= 5) {
        alert("Máximo de 5 opções atingido.");
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

    // Evento de clique para remover o <li>, exceto o primeiro item com id "input01"
    btnRemover.addEventListener('click', () => {
        if (fundo.id !== "input01") {  // Verifica se não é o primeiro item
            listaDeEnquetes.removeChild(fundo);
            atualizarPlaceholders();  // Atualiza os placeholders após remoção
        }
    });

    // Definindo um id único para o novo <li>
    fundo.id = `input-${listaDeEnquetes.children.length + 1}`;

    // Adicionando os elementos no <li> e depois na lista
    fundo.appendChild(inputTexto);
    fundo.appendChild(btnRemover);
    listaDeEnquetes.appendChild(fundo);

    // Atualiza os placeholders após adicionar um novo item
    atualizarPlaceholders();
}

// Função para limpar todos os itens, exceto o primeiro
function limpar() {
    const listaDeEnquetes = document.getElementById("listaDeEnquetes");

    // Mantém o primeiro item com id "input01"
    const primeiroItem = document.getElementById("input01");
    listaDeEnquetes.innerHTML = ''; // Remove todos os itens

    // Reinsere o primeiro item
    if (primeiroItem) {
        listaDeEnquetes.appendChild(primeiroItem.closest('li'));
    }
}

function showPage(tabId, element) {
    // Oculta todas as páginas
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    // Remove a classe ativa de todas as abas
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

    // Mostra a página correspondente e marca a aba como ativa
    document.getElementById(tabId).classList.add('active');
    element.classList.add('active');
}


// Gerando um código único
// Função para gerar um código único
// Função para gerar um código único
// Função para gerar um código único

// Gerando um código único
function gerarCodigoUnico() {
    return 'xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
        (Math.random() * 16 | 0).toString(16)
    );
}

//const codigo = gerarCodigoUnico();
//console.log("Código gerado:", codigo);

const userId = "DANILSILVA"; // Id do usuário autenticado
const codigoUnico = gerarCodigoUnico();

//firebase.database().ref(`usuarios/${userId}`).set({
   // codigoConvite: codigoUnico,
//});

const linkCompartilhamento = `${window.location.origin}/?ref=${codigoUnico}`;
console.log("Link de convite:", linkCompartilhamento);