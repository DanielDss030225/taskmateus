



function adicionarOpcoes() {
    
    
    const elemento = document.getElementById('opcoes02');

    if (elemento.style.display === 'none') {
        elemento.style.display = 'flex';
    } else {
        const elemento = document.getElementById('opcoes03');

        if (elemento.style.display === 'none') {
            elemento.style.display = 'flex';
        } else {
            const elemento = document.getElementById('opcoes04');

            if (elemento.style.display === 'none') {
                elemento.style.display = 'flex';
            } else {
                const elemento = document.getElementById('opcoes05');

                if (elemento.style.display === 'none') {
                    elemento.style.display = 'flex';
                } else {
                    alert("Atenção! Adicione no máximo 5 opções para esta enquete!");

                }            }        }
    
    }


}


function tornarinvisivel02() {
    // Seleciona o elemento pelo id
    const elemento = document.getElementById('opcoes02');

        elemento.style.display = 'none';
        input02.value=""
        
}


function tornarinvisivel03() {
    // Seleciona o elemento pelo id
    const elemento = document.getElementById('opcoes03');

        elemento.style.display = 'none';
        input03.value=""

    
}

function tornarinvisivel04() {
    // Seleciona o elemento pelo id
    const elemento = document.getElementById('opcoes04');

        elemento.style.display = 'none';
        input04.value=""
    
}

function tornarinvisivel05() {
    // Seleciona o elemento pelo id
    const elemento = document.getElementById('opcoes05');

        elemento.style.display = 'none';
        input05.value=""

    
    
}

function limpar(){
    const elemento2 = document.getElementById('opcoes02');
    const elemento3 = document.getElementById('opcoes03');
    const elemento4 = document.getElementById('opcoes04');
    const elemento5 = document.getElementById('opcoes05');
    elemento2.style.display = 'none';
    elemento3.style.display = 'none';
    elemento4.style.display = 'none';
    elemento5.style.display = 'none';
    input01.value=""
    input02.value=""
    input03.value=""
    input04.value=""
    input05.value=""



}