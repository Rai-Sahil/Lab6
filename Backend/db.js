const mysql = require('mysql');
const databaseName = "dictionary";
const tableName = "words";
const languageTableName = "language";
// SQL queries
const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
const useDatabaseQuery = `USE ${databaseName}`;
const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (word VARCHAR(255), definition VARCHAR(255), wordLanguage VARCHAR(255), definitionLanguage VARCHAR(255))`;
const createTableLanguageQuery = `CREATE TABLE IF NOT EXISTS ${languageTableName} (language VARCHAR(255))`;
const insertLanguageTableQuery = `INSERT INTO ${languageTableName} (language) VALUES ?"`;
const selectLanguageTableQuery = `SELECT language FROM ${languageTableName}`;
const insertWordQuery = `INSERT INTO ${tableName} (word, definition, wordLanguage, definitionLanguage) VALUES (?, ?, ?, ?)`;
const updateWordQuery = `UPDATE ${tableName} SET definition = ?, wordLanguage = ?, definitionLanguage = ? WHERE word = ?`;
const deleteWordQuery = `DELETE FROM ${tableName} WHERE word = ?`;
const selectWordQuery = `SELECT * FROM ${tableName} WHERE word = ?`;
const english = "English";
const chinese = "Chinese";
const arabic = "Arabic";
const resultLog = "results are: ";
const log1 = "All languages already exist in the database. No languages added.";
const log2 = "Word inserted successfully";
const databaseLog = "Database created";
const tableLog = "Table created";
const databaseUseLog = "Using database";

var con = mysql.createConnection({
    host: "localhost",
    port: "3333",
    user: "root",
    password: "secret"
})

function createDatabase() {
    con.query(createDatabaseQuery, function (err, result) {
        if (err) throw err;
        console.log(databaseLog);
    })

    con.query(useDatabaseQuery, function (err, result) {
        if (err) throw err;
        console.log(databaseUseLog);
    })
}

function createTable() {
    con.query(createTableQuery, function (err, result) {
        if (err) throw err;
        console.log(tableLog);
    });
}

function createTableLanguage() {
    return new Promise((resolve, reject) => {
        con.query(createTableLanguageQuery, async (err, result) => {
            console.log(resultLog + JSON.stringify(result));
            if (err) reject(err);
            else resolve(result);
        });
    })
}

function addLanguages() {
    return new Promise((resolve, reject) => {
        const languages = [english, chinese, arabic];

        con.query(selectLanguageTableQuery, function (err, result) {
            if (err) throw err;

            const existingLanguages = result.map(row => row.language);
            const newLanguages = languages.filter(language => !existingLanguages.includes(language));

            if (newLanguages.length === 0) {
                console.log(log1);
                resolve();
            } else {
                const sql = insertLanguageTableQuery;
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
        const query = selectWordQuery;

        con.query(query, [word], function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log(resultLog + JSON.stringify(result));
                resolve(result.length > 0);
            }
        });
    });
};

exports.insertWord = function (word, definition, wordLanguage, definitionLanguage) {
    createDatabase();
    createTable();
    const sql = insertWordQuery;
    const values = [word, definition, wordLanguage, definitionLanguage];

    con.query(sql, values, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(log2);
        }
    });
}

exports.updateWord = function (word, definition, wordLanguage, definitionLanguage) {
    createDatabase();
    createTable();
    return new Promise((resolve, reject) => {
        const query = updateWordQuery;
        const values = [definition, wordLanguage, definitionLanguage, word];

        con.query(query, values, function (err, result) {
            if (err) {
                reject(err);
            } else {
                console.log(resultLog + JSON.stringify(result));
                resolve(result);
            }
        });
    });
}

exports.deleteWord = function (word) {
    createDatabase();
    createTable();
    return new Promise((resolve, reject) => {
        const query = deleteWordQuery;

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
        const query = selectWordQuery;

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
        con.query(selectLanguageTableQuery, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};
