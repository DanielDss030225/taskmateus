const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config(); // Carrega variáveis de ambiente de um arquivo .env

const app = express();
const PORT = process.env.PORT || 3000; // Usa a porta do ambiente ou 3000

// Caminho para a chave privada do Firebase
const serviceAccount = require('./chave-privada-firebase.json');

// Inicializa o Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://task-matheus-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Middleware para servir arquivos estáticos (como index.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para verificar o código de convite
app.get('/verificar-convite', async (req, res) => {
  const codigo = req.query.ref;

  if (!codigo) {
    return res.status(400).send("Código ausente.");
  }

  try {
    const ref = db.ref('convites/' + codigo);
    const snapshot = await ref.once('value');

    if (snapshot.exists()) {
      res.json({ valido: true, dados: snapshot.val() });
    } else {
      res.json({ valido: false });
    }
  } catch (err) {
    console.error("Erro ao acessar o Firebase:", err);
    res.status(500).send("Erro interno no servidor.");
  }
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
