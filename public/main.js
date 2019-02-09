(() => {
    GetGames();

    async function GetGames() {
        let response = await fetch('http://localhost:3000/games');
        let games = await response.json();
        games.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
        BuildCards(games);
    }

    function BuildCards(games) {
        let cardHolder = document.getElementById('cardHolder');
        games.forEach((game) => {
            let borderClass;

            if (game.fiveStarRating == 5) {
                borderClass = 'border-success';
            } else if (game.fiveStarRating == 4) {
                borderClass = 'border-primary';
            } else if (game.fiveStarRating == 2) {
                borderClass = 'border-secondary';
            } else if (game.fiveStarRating == 2) {
                borderClass = 'border-warning';
            } else if (game.fiveStarRating == 1) {
                borderClass = 'border-danger';
            }

            let mainNode = document.createElement('div');
            mainNode.className = `card ${borderClass}`;

            let bodyNode = document.createElement('div');
            bodyNode.className = 'card-body';
            mainNode.appendChild(bodyNode);

            let titleNode = document.createElement('h5');
            titleNode.className = 'card-title';
            titleNode.appendChild(document.createTextNode(`${game.name} (${game.originalPlatform})`));
            bodyNode.appendChild(titleNode);

            let ratingNode = document.createElement('h6');
            ratingNode.className = 'card-subtitle mb-2 text-muted';
            ratingNode.appendChild(document.createTextNode(`Star Rating : ${game.fiveStarRating} / 5`));
            bodyNode.appendChild(ratingNode);

            let cTextNode = document.createElement('p');
            cTextNode.className = 'card-text';
            cTextNode.appendChild(document.createTextNode(game.review));
            bodyNode.appendChild(cTextNode);

            cardHolder.appendChild(mainNode);
        });
    }
})();