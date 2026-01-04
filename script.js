import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Configura amb les teves credencials de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBk5zHrSflhQ86zgsiqSPIZuk_89jc5fwQ",
    authDomain: "cinemaday-e68f3.firebaseapp.com",
    projectId: "cinemaday-e68f3",
    storageBucket: "cinemaday-e68f3.firebasestorage.app",
    messagingSenderId: "690653919118",
    appId: "1:690653919118:web:d5adaa4bf81261858f96df",
    measurementId: "G-HZ9Y4DMDS3"
};

// Inicialitza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Inicia sessió anònima
signInAnonymously(auth)
    .then(() => {
        console.log("Usuari autenticat anònimament");
        loadData();
    })
    .catch((error) => {
        console.error("Error en autenticació:", error);
    });

// Carregar dades des de Firestore
async function loadData() {
    const rows = document.querySelectorAll('#calendar-table tbody tr');
    rows.forEach(async (row) => {
        const dateCell = row.cells[0].textContent;
        const input = row.querySelector('input');
        if (input) {
            const docRef = doc(db, 'pelicules', dateCell.replace(/\s/g, '-'));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                input.value = docSnap.data().peli || '';
            }
            input.addEventListener('input', async function() {
                await setDoc(docRef, { peli: this.value });
            });
        }
    });
}