const searchForm = document.getElementById('searchForm');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const word = document.getElementById('searchWord').value;

    const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    fetch(`http://localhost:3000/api/v1/definition/${word}`, options)
        .then(res => res.json())
        .then(res => {
            if (res.message) alert(res.message);
            else {
                console.log(res);
                document.getElementById('definition').textContent = res[0].definition;
                document.getElementById('wordLanguage').textContent = res[0].wordLanguage;
                document.getElementById('definitionLanguage').textContent = res[0].definitionLanguage;
            }
        })
        .catch(err => console.error(err));
});