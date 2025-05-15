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
