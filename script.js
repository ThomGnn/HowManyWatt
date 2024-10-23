// On stocke les données pour chaque type d'énergie
const energyData = {
    electricity: { expense: 0, revenue: 0, transactions: [] },
    water: { expense: 0, revenue: 0, transactions: [] },
    gas: { expense: 0, revenue: 0, transactions: [] },
    fuel: { expense: 0, revenue: 0, transactions: [] }
};

// Charger les données à partir de localStorage
function loadEnergyData() {
    const storedData = JSON.parse(localStorage.getItem('energyData'));
    if (storedData) {
        Object.keys(energyData).forEach(key => {
            if (storedData[key]) {
                energyData[key] = storedData[key];
            }
        });
    }
}

// Mise à jour de l'interface avec les nouvelles données
function updateEnergyUI(energyType) {
    const expenseElem = document.querySelector(`.${energyType}-expense`);
    const revenueElem = document.querySelector(`.${energyType}-revenue`);
    const totalElem = document.querySelector(`.${energyType}-total`);

    // Mettre à jour les valeurs
    expenseElem.textContent = `${energyData[energyType].expense} €`;
    revenueElem.textContent = `${energyData[energyType].revenue} €`;

    // Calculer le total (recettes - dépenses)
    const total = energyData[energyType].revenue - energyData[energyType].expense;
    totalElem.textContent = `${total} €`;
}

// Fonction appelée lors de la soumission du formulaire
document.getElementById('energy-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Empêche le rechargement de la page

    // Récupérer les valeurs du formulaire
    const energyType = document.getElementById('energy-type').value;
    const entryType = document.getElementById('entry-type').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!isNaN(amount)) {
        // Ajouter le montant à la dépense ou à la recette en fonction du type d'entrée
        if (entryType === 'expense') {
            energyData[energyType].expense += amount;
            energyData[energyType].transactions.push({ type: 'Dépense', amount: amount });
        } else if (entryType === 'revenue') {
            energyData[energyType].revenue += amount;
            energyData[energyType].transactions.push({ type: 'Recette', amount: amount });
        }

        // Utiliser fetch pour envoyer les données au serveur
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    energyType: energyType,
                    entryType: entryType,
                    amount: amount
                })
            });

            // Vérifiez la réponse dans la console
            console.log('Réponse du serveur:', response);
            
            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi des données.');
            }

            // Récupérer la réponse du serveur
            const result = await response.json();
            console.log('Résultat de la réponse:', result); // Affichez le contenu des données

            // Mettre à jour les données d'énergie avec les valeurs renvoyées
            energyData[energyType].expense = result.expense || energyData[energyType].expense;
            energyData[energyType].revenue = result.revenue || energyData[energyType].revenue;

            // Mettre à jour l'interface utilisateur
            updateEnergyUI(energyType);

            // Sauvegarder les données dans localStorage
            localStorage.setItem('energyData', JSON.stringify(energyData));

            // Réinitialiser le formulaire
            document.getElementById('energy-form').reset();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur s\'est produite. Veuillez réessayer.');
        }
    }
});

// Afficher les transactions
function displayTransactions(energyType) {
    const transactionsList = document.querySelector(`.${energyType}-transactions`);
    transactionsList.innerHTML = ''; // Effacer les anciennes transactions

    if (energyData[energyType].transactions.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Aucune transaction enregistrée.';
        transactionsList.appendChild(li);
    } else {
        energyData[energyType].transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.textContent = `${transaction.type}: ${transaction.amount} €`;
            transactionsList.appendChild(li);
        });
    }

    transactionsList.style.display = 'block';
}

// Ajouter des écouteurs d'événements aux boutons de transactions
function setupTransactionButtons() {
    document.addEventListener('DOMContentLoaded', () => {
        Object.keys(energyData).forEach(key => {
            const button = document.querySelector(`.${key}-view-transactions`);
            if (button) {
                button.addEventListener('click', () => {
                    displayTransactions(key); // Passez la clé comme energyType
                });
            } else {
                console.warn(`Bouton pour ${key} non trouvé.`);
            }
        });
    });
}

// Charger les données au démarrage
loadEnergyData();
setupTransactionButtons();
