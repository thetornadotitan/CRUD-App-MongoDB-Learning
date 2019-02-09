(() => {

    GetGames();

    let newGameForm = document.getElementById('newGameForm');
    newGameForm.onsubmit = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:3000/edit/newgame", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                name: e.path[0][0].value,
                originalPlatform: e.path[0][1].value,
                fiveStarRating: e.path[0][2].value,
                review: e.path[0][3].value
            })
        })
        GetGames();
    };

    async function GetGames() {
        let response = await fetch('http://localhost:3000/games');
        let games = await response.json();
        games.sort((a, b) => (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0);
        BuildCards(games);
    }

    async function GetGame(gameID) {
        let response = await fetch("http://localhost:3000/game", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                _id: gameID
            })
        });
        let result = await response.json();
        return result[0];
    }

    function BuildCards(games) {
        let cardHolder = document.getElementById('cardHolder');
        while (cardHolder.firstChild) {
            cardHolder.removeChild(cardHolder.firstChild);
        }

        games.forEach((game) => {
            let borderClass;

            if (game.fiveStarRating == 5) {
                borderClass = 'border-success';
            } else if (game.fiveStarRating == 4) {
                borderClass = 'border-primary';
            } else if (game.fiveStarRating == 3) {
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

            let buttonHolder = document.createElement('div');
            buttonHolder.className = 'd-flex justify-content-end'

            let editButton = document.createElement('button');
            editButton.className = 'btn btn-primary';
            editButton.setAttribute('data-gameID', game._id);
            editButton.appendChild(document.createTextNode('Edit'));
            editButton.onclick = () => { EditClick(editButton) };
            buttonHolder.appendChild(editButton);

            let deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.setAttribute('data-gameID', game._id);
            deleteButton.appendChild(document.createTextNode('Delete'));
            deleteButton.onclick = () => { DeleteClick(deleteButton) };
            buttonHolder.appendChild(deleteButton);

            bodyNode.appendChild(buttonHolder);
            cardHolder.appendChild(mainNode);
        });
    }

    async function EditClick(obj) {
        let gameID = obj.getAttribute('data-gameID');
        let targetNode = obj.parentElement.parentElement;
        while (targetNode.firstChild) {
            targetNode.removeChild(targetNode.firstChild);
        }
        targetNode.appendChild(CreateEditableGame(await GetGame(gameID)));
        targetNode.firstChild.nextSibling.onsubmit = async (e) => {
            e.preventDefault();
            await fetch("http://localhost:3000/edit/editgame", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                //make sure to serialize your JSON body
                body: JSON.stringify({
                    _id: gameID,
                    name: e.path[0][0].value,
                    originalPlatform: e.path[0][1].value,
                    fiveStarRating: e.path[0][2].value,
                    review: e.path[0][3].value
                })
            })
            GetGames();
        };
    }

    function CreateEditableGame(game) {
        let node = document.createRange().createContextualFragment(`
        <form id='editGameForm' method="POST" action="">
            <div class="form-group">
                <label for="editName">Game Name:</label>
                <input type="text" class="form-control" id="editName" aria-describedby="editNameHelp"
                    placeholder="Final Fantasy I" value='${game.name}' required>
                <small id="editNameHelp" class="form-text text-muted">Enter the name of the game to
                    add.</small>
            </div>
            <div class="form-group">
                <label for="editoriginalPlatform">Original Platform</label>
                <input type="text" class="form-control" id="editoriginalPlatform" aria-describedby="editoriginalPlatformHelp"
                    placeholder="NES" value='${game.originalPlatform}' required>
                <small id="editoriginalPlatformHelp" class="form-text text-muted">Enter the most
                    commonly used abbreviation for the original system this game was release on.</small>
            </div>
            <div class="form-group">
                <label for="editrating">Rating</label>
                <input type="number" class="form-control" id="editrating" aria-describedby="editratingHelp"
                    placeholder="5" min="1" max="5" value='${game.fiveStarRating}' required>
                <small id="editratingHelp" class="form-text text-muted">Enter a rating out of 5 with a
                    minimum of 1</small>
            </div>
            <div class="form-group">
                <label for="editreview">Review</label>
                <textarea class="form-control" id="editreview" placeholder="It was alright">${game.review}</textarea>
            </div>
            <button type='submit' id="gameSubmit" class="btn btn-primary">Submit</button>
        </form>`
        );
        return node;
    }

    async function DeleteClick(obj) {
        await fetch("http://localhost:3000/edit/delgame", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify({
                id: obj.getAttribute('data-gameID')
            })
        })
        GetGames();
    }
})();