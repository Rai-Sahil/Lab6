document.addEventListener('DOMContentLoaded', function () {
    const entryForm = document.getElementById('entryForm');
    getLanguages();

    entryForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const wordInput = document.getElementById('word').value;
        const definitionInput = document.getElementById('definition').value;
        const wordLanguageSelect = document.getElementById('wordLanguage').value;
        const definitionLanguageSelect = document.getElementById('definitionLanguage').value;

        const entry = {
            word: wordInput,
            definition: definitionInput,
            wordLanguage: wordLanguageSelect,
            definitionLanguage: definitionLanguageSelect
        };

        const options = {
            method: 'POST',
            body: JSON.stringify(entry),
            headers: { 'Content-Type': 'application/json' }
        };

        fetch('http://localhost:3000/api/v1/definition', options)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.action === 'inserted') alert(res.message);
                else if (res.action === 'update') {
                    if (confirm(res.message)) {
                        updatePatch(wordInput, definitionInput, wordLanguageSelect, definitionLanguageSelect);
                    }
                }
            })
            .catch(err => console.error(err));
    });

    function updatePatch(word, definition, wordLanguage, definitionLanguage) {
        const options = {
            method: 'PATCH',
            body: JSON.stringify({ definition: definition, wordLanguage: wordLanguage, definitionLanguage: definitionLanguage }),
            headers: { 'Content-Type': 'application/json' }
        };
        fetch(`http://localhost:3000/api/v1/definition/${word}`, options)
            .then(res => res.json())
            .then(res => {
                if (res.message) alert(res.message);
            })
            .catch(err => console.error(err));
    }

    function deleteWord() {
        const word = document.getElementById('word').value;
        const options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch(`http://localhost:3000/api/v1/definition/${word}`, options)
            .then(res => res.json())
            .then(res => {
                if (res.message) alert(res.message);
            })
            .catch(err => console.error(err));
    }

    function getLanguages() {
        fetch('http://localhost:3000/api/v1/languages')
            .then(res => res.json())
            .then(res => {
                const wordLanguageSelect = document.getElementById('wordLanguage');
                const definitionLanguageSelect = document.getElementById('definitionLanguage');
                console.log(res)
                res.forEach(language => {
                    const wordOption = document.createElement('option');
                    wordOption.value = language.language;
                    wordOption.innerText = language.language;
                    wordLanguageSelect.appendChild(wordOption);

                    const definitionOption = document.createElement('option');
                    definitionOption.value = language.language;
                    definitionOption.innerText = language.language;
                    definitionLanguageSelect.appendChild(definitionOption);
                });
            })
            .catch(err => console.error(err));
    }
});