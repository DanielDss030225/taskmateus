// Em outro arquivo do seu backend
const { database } = require('./firebase-config');
// Exporta o database para ser usado em outras partes do backend
module.exports = { database };

const params = new URLSearchParams(window.location.search);
const codigoConvite = params.get('ref');

if (codigoConvite) {
    fetch(`/verificar-convite?ref=${codigoConvite}`)
        .then(res => res.json())
        .then(data => {
            if (data.valido) {
                console.log("Convite válido:", data.dados);
            } else {
                console.log("Convite inválido.");
            }
        });
}
