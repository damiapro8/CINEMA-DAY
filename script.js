// Carregar dades des de Firestore
window.onload = async function() {
    const rows = document.querySelectorAll('#calendar-table tbody tr');
    rows.forEach(async (row, index) => {
        const dateCell = row.cells[0].textContent;
        const input = row.querySelector('input');
        if (input) {
            // Carregar des de Firestore
            const docRef = doc(window.db, 'pelicules', dateCell.replace(/\s/g, '-'));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                input.value = docSnap.data().peli || '';
            }
            // Guardar en canviar
            input.addEventListener('input', async function() {
                await setDoc(docRef, { peli: this.value });
            });
        }
    });
};