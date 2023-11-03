const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

const dictionary = [];

app.use(bodyParser.json());
app.use(cors());

// Create a new dictionary entry or update if the word exists
app.post('/api/v1/definition', async (req, res) => {
  const newEntry = req.body;

  if (await db.wordExists(newEntry.word)) {
    return res.status(200).json({
      message: 'Word already exists in the dictionary. Do you want to update the definition?',
      word: newEntry.word,
      action: 'update',
    });
  } else {
    db.insertWord(newEntry.word, newEntry.definition, newEntry.wordLanguage, newEntry.definitionLanguage)
    res.status(201).json({ message: 'Dictionary entry created successfully', entry: newEntry, action: 'inserted' })
  }

  console.log('DB check result is ' + db.wordExists(newEntry.word));
});

// Handle the update when the user confirms
app.patch('/api/v1/definition/:word', (req, res) => {
  const wordToUpdate = req.params.word;
  const newDefinition = req.body.definition;
  const newWordLanguage = req.body.wordLanguage;
  const newDefinitionLanguage = req.body.definitionLanguage;

  if (db.updateWord(wordToUpdate, newDefinition, newWordLanguage, newDefinitionLanguage)) {
    res.status(200).json({ message: 'Dictionary entry updated successfully' });
  } else {
    res.status(404).json({ message: 'Word not found in the dictionary' });
  }
});

// Retrieve the definition of a word
app.get('/api/v1/definition/:word', async (req, res) => {
  const wordToRetrieve = req.params.word;
  const wordExists = await db.wordExists(wordToRetrieve);

  if (wordExists) {
    const definition = await db.getDefinition(wordToRetrieve);
    res.status(200).json(definition);
  } else {
    res.status(404).json({ message: 'Word not found in the dictionary' });
  }

});

// Remove the word and its definition
app.delete('/api/v1/definition/:word', async (req, res) => {
  const wordToDelete = req.params.word;
  if (await db.deleteWord(wordToDelete)) {
    res.status(204).send();
    console.log("Word deleted successfully")
  } else {
    res.status(404).json({ message: 'Word not found in the dictionary' });
  }
});

// Retrieve supported languages
app.get('/api/v1/languages', async (req, res) => {
  // Replace with your list of supported languages
  const supportedLanguages = await db.getLanguages();
  res.status(200).json(supportedLanguages);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function getWordDefinition(wordToRetrieve) {
  return dictionary.find(entry => entry.word === wordToRetrieve);
}
