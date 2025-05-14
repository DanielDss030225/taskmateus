

// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyANhYoZo47qW07a5MEu6b5Selo1pw3Mf8Y",
    authDomain: "task-matheus.firebaseapp.com",
    projectId: "task-matheus",
    storageBucket: "task-matheus.firebasestorage.app",
    messagingSenderId: "948521081001",
    appId: "1:948521081001:web:d22d6705775c92798931b8",
    measurementId: "G-YT5CSP5S0T"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Função para salvar dados
export function salvarDados(uid, nome, email) {
    set(ref(database, 'usuarios/' + uid), {
        nome: nome,
        email: email
    })
    .then(() => {
        console.log("Dados salvos com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao salvar dados: ", error);
    });
}
