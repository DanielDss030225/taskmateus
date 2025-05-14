// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyANhYoZo47qW07a5MEu6b5Selo1pw3Mf8Y",
    authDomain: "task-matheus.firebaseapp.com",
    databaseURL: "https://task-matheus-default-rtdb.firebaseio.com", // URL do Realtime Database
    projectId: "task-matheus",
    storageBucket: "task-matheus.appspot.com", // Corrigido para .com
    messagingSenderId: "948521081001",
    appId: "1:948521081001:web:d22d6705775c92798931b8",
    measurementId: "G-YT5CSP5S0T"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);


// Captura os parâmetros da URL
const params = new URLSearchParams(window.location.search);
const codigoConvite = params.get('ref');

if (codigoConvite) {
    console.log("Código de convite detectado:", codigoConvite);
    verificarConviteNoFirebase(codigoConvite);
}