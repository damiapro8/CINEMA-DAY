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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Inicia sessió anònima
auth.signInAnonymously()
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
            // Nom de la col·lecció: 'pelicules' (canvia aquí si és diferent a Firestore)
            const docRef = db.collection('pelicules').doc(dateCell.replace(/\s/g, '-'));
            const docSnap = await docRef.get();
            if (docSnap.exists) {
                input.value = docSnap.data().peli || '';
            }
            input.addEventListener('input', async function() {
                await docRef.set({ peli: this.value });
            });
        }
    });
}