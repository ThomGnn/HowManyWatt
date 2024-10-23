const mysql = require('mysql2');

// Créer une connexion à la base de données
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'userpassword',
    database: 'your_database'
});

// Connecter à la base de données
connection.connect(err => {
    if (err) throw err;
    console.log('Connecté à la base de données MySQL!');

    // Appel de la fonction pour créer une entrée
    const newData = { data: 'Exemple de donnée' };
    createEntry(newData);

    // Appel de la fonction pour lire les entrées
    readEntries();

    // Fermer la connexion après les opérations
    connection.end();
});

// CRUD Operations

// Create
const createEntry = (data) => {
    const query = 'INSERT INTO your_table SET ?';
    connection.query(query, data, (err, results) => {
        if (err) throw err;
        console.log('Entrée créée:', results.insertId);
    });
};

// Read
const readEntries = () => {
    const query = 'SELECT * FROM your_table';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.log('Données:', results);
    });
};

// Update
const updateEntry = (id, newData) => {
    const query = 'UPDATE your_table SET ? WHERE id = ?';
    connection.query(query, [newData, id], (err, results) => {
        if (err) throw err;
        console.log('Entrée mise à jour:', results.affectedRows);
    });
};

// Delete
const deleteEntry = (id) => {
    const query = 'DELETE FROM your_table WHERE id = ?';
    connection.query(query, id, (err, results) => {
        if (err) throw err;
        console.log('Entrée supprimée:', results.affectedRows);
    });
};
