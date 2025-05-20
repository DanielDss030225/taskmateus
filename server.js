import express from 'express';
import cors from 'cors';
import { database } from './meu-projeto-backend/firebase-config.js';  // Certifique-se de que o caminho está correto
import { ref, set, get } from 'firebase/database';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json()); // Para ler dados JSON no corpo das requisições

// Servir arquivos estáticos da pasta 'TAREFA DO MATEUS'
const staticFolderPath = path.join(__dirname, 'TAREFA DO MATEUS');
app.use(express.static(staticFolderPath)); 

// Rota para salvar dados
app.post('/api/usuarios', async (req, res) => {
  const { id, nome, idade } = req.body;

  // Validação de campos
  if (!id || !nome || !idade) {
    return res.status(400).json({ erro: 'Campos obrigatórios: id, nome, idade' });
  }

  try {
    // Salva os dados no Firebase Realtime Database
    await set(ref(database, `usuarios/${id}`), { nome, idade });
    res.status(200).json({ mensagem: 'Usuário salvo com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao salvar usuário', detalhe: error.message });
  }
});

// Rota para buscar dados
app.get('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const snapshot = await get(ref(database, `usuarios/${id}`));
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).json({ erro: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuário', detalhe: error.message });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
