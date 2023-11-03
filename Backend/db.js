const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    port: "3333",
    user: "root",
    password: "secret"
})

function createDatabase() {
    con.query("CREATE DATABASE IF NOT EXISTS dictionary", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    })

    con.query("USE dictionary", function (err, result) {
        if (err) throw err;
        console.log("Using database");
    })
}

function createTable() {
    con.query("CREATE TABLE IF NOT EXISTS words (word VARCHAR(255), definition VARCHAR(255), wordLanguage VARCHAR(255), definitionLanguage VARCHAR(255))", function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
}

function createTableLanguage() {
    return new Promise((resolve, reject) => {
        con.query('CREATE TABLE IF NOT EXISTS language (language VARCHAR(255))', async (err, result) => {
            console.log('result is : ' + JSON.stringify(result));
            if (err) reject(err);
            else resolve(result);
        });
    })
}

function addLanguages() {
    return new Promise((resolve, reject) => {
        const languages = ['English', 'Chinese', 'Arabic'];

        con.query('SELECT language FROM language', function (err, result) {
            if (err) throw err;

            const existingLanguages = result.map(row => row.language);
            const newLanguages = languages.filter(language => !existingLanguages.includes(language));

            if (newLanguages.length === 0) {
                console.log("All languages already exist in the database. No languages added.");
                resolve();
            } else {
                const sql = "INSERT INTO language (language) VALUES ?";
                const values = newLanguages.map(language => [language]);

                con.query(sql, [values], function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            }
        });
    });
}


exports.wordExists = function (word) {
    return new Promise((resolve, reject) => {
        createDatabase();
        createTable();
        const query = "SELECT * FROM words WHERE word= ?";

        con.query(query, [word], function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log('results are: ' + JSON.stringify(result));
                resolve(result.length > 0);
            }
        });
    });
};

exports.insertWord = function (word, definition, wordLanguage, definitionLanguage) {
    createDatabase();
    createTable();
    const sql = "INSERT INTO words (word, definition, wordLanguage, definitionLanguage) VALUES (?, ?, ?, ?)";
    const values = [word, definition, wordLanguage, definitionLanguage];

    con.query(sql, values, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Word inserted successfully");
        }
    });
}

exports.updateWord = function (word, definition, wordLanguage, definitionLanguage) {
    createDatabase();
    createTable();
    return new Promise((resolve, reject) => {
        const query = "UPDATE words SET definition = ?, wordLanguage = ?, definitionLanguage = ? WHERE word = ?";
        const values = [definition, wordLanguage, definitionLanguage, word];

        con.query(query, values, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log('results are: ' + JSON.stringify(result));
                resolve(result);
            }
        });
    });
}

exports.deleteWord = function (word) {
    createDatabase();
    createTable();
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM words WHERE word = ?";

        con.query(query, [word], function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

exports.getDefinition = function (word) {
    createDatabase();
    createTable();
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM words WHERE word = ?";

        con.query(query, [word], function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

exports.getLanguages = async function () {
    await createDatabase();
    await createTableLanguage();
    await addLanguages();

    return new Promise((resolve, reject) => {
        con.query('SELECT language FROM language', (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
