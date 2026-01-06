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
    const tbody = document.querySelector('#calendar-table tbody');
    tbody.innerHTML = ''; // Neteja taula

    const names = ['Papa', 'Mama', 'Dídac', 'Damià', 'Duna', 'Debra'];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Obté totes les dades existents
    const snapshot = await db.collection('pelicules').get();
    const dataMap = {};
    snapshot.forEach(doc => {
        const dateStr = doc.id.replace(/-/g, ' '); // Torna a format amb espais
        dataMap[dateStr] = doc.data().peli || '';
    });

    // Llista de dates: passades + 6 futures
    const allDates = Object.keys(dataMap);
    const futureDates = generateFutureFridays(today, 6);
    allDates.push(...futureDates.filter(d => !allDates.includes(d)));

    // Ordena per data
    allDates.sort((a, b) => parseDate(a) - parseDate(b));

    allDates.forEach(dateStr => {
        const peli = dataMap[dateStr] || '';
        const eventDate = parseDate(dateStr);
        const isPast = eventDate < today;
        const nameIndex = Math.floor((eventDate - new Date(2026, 0, 1)) / (7 * 24 * 60 * 60 * 1000)) % names.length; // Rotació basada en setmanes des d'un punt
        const name = names[nameIndex];

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dateStr}</td>
            <td>${name}</td>
            <td><input type="text" placeholder="Escriu la pel·lícula" value="${peli}"></td>
        `;
        tbody.appendChild(row);

        const input = row.querySelector('input');
        const docRef = db.collection('pelicules').doc(dateStr.replace(/\s/g, '-'));

        if (isPast) {
            input.disabled = true;
            input.placeholder = 'Data passada - no editable';
        } else {
            input.addEventListener('input', async function() {
                await docRef.set({ peli: this.value });
            });
        }
    });
}

// Genera les properes n dates de divendres
function generateFutureFridays(startDate, n) {
    const dates = [];
    let currentDate = new Date(startDate);
    const dayOfWeek = currentDate.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    currentDate.setDate(currentDate.getDate() + daysUntilFriday);
    if (currentDate <= startDate) {
        currentDate.setDate(currentDate.getDate() + 7);
    }

    for (let i = 0; i < n; i++) {
        dates.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 7);
    }
    return dates;
}

// Funció per formatar la data en català
function formatDate(date) {
    const months = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
}

// Funció per parsejar la data en català
function parseDate(dateStr) {
    const months = {
        'gener': 0, 'febrer': 1, 'març': 2, 'abril': 3, 'maig': 4, 'juny': 5,
        'juliol': 6, 'agost': 7, 'setembre': 8, 'octubre': 9, 'novembre': 10, 'desembre': 11
    };
    const parts = dateStr.split(' de ');
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
}