// Função para atualizar os placeholders após adicionar ou remover
function atualizarPlaceholders() {
    const inputs = document.querySelectorAll('#listaDeEnquetes input');
    inputs.forEach((input, index) => {
        const numero = (index + 1).toString().padStart(2, '0');
        input.placeholder = `Opção ${numero}`;
    });
}

// Função para adicionar uma nova opção
function adicionarOpcoes() {
    let listaDeEnquetes = document.getElementById("listaDeEnquetes");

    // Cria os elementos necessários
    let fundo = document.createElement("li");
    let inputTexto = document.createElement('input');
    let btnRemover = document.createElement('button');

    // Configurações do input
    inputTexto.type = 'text';

    // Configurações do botão
    btnRemover.textContent = 'X';

    // Evento de clique para remover o <li>
    btnRemover.addEventListener('click', () => {
        listaDeEnquetes.removeChild(fundo);
        atualizarPlaceholders();
    });

    // Adicionando os elementos no <li> e depois na lista
    fundo.appendChild(inputTexto);
    fundo.appendChild(btnRemover);
    listaDeEnquetes.appendChild(fundo);

    // Atualiza os placeholders após adicionar um novo item
    atualizarPlaceholders();
}

// Função para limpar todos os itens
function limpar() {
    const listaDeEnquetes = document.getElementById("listaDeEnquetes");
    listaDeEnquetes.innerHTML = ''; // Remove todos os elementos internos
}
