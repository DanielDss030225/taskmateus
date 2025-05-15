const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = 3000;

const serviceAccount = require('./chave-privada-firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://task-matheus-default-rtdb.firebaseio.com"
});

const db = admin.database();

app.get('/verificar-convite', async (req, res) => {
  const codigo = req.query.ref;
  if (!codigo) return res.status(400).send("Código ausente.");

  const ref = db.ref('convites/' + codigo);
  const snapshot = await ref.once('value');

  if (snapshot.exists()) {
    res.json({ valido: true, dados: snapshot.val() });
  } else {
    res.json({ valido: false });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
