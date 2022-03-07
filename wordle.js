let height = 6; //number of guesses
let width = 5; //length of words

let row = 0; //current guess (attempt #)
let col = 0; //current letter for that attempt

let gameOver = false;
let currWord = "";

window.onload = function() { // when a page loads, call this function
    initialize();
};

function initialize() {
    // generate today's word
    let todaysWord = "";

    const options = {
    method: 'GET',
    url: 'https://wordsapiv1.p.rapidapi.com/words/',
    params: {random: 'true',
             letters: '5'},
    headers: {
        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
        'x-rapidapi-key': 'c0f74f441cmsh567cad65aabece8p1aad19jsn4142e09a557d'
    }
    };

    axios.request(options).then(function (response) {
        // set today's word
        todaysWord = response.data.word.toUpperCase();
        console.log('오늘의 단어', todaysWord)
    }).catch(function (error) {
        console.error(error);
    });


    // create the board
    for (let r = 0; r < height; r++) {
        //<div id="row0" class="rows"></div>
        let row = document.createElement("div");
        row.id = "row" + r.toString()
        row.classList.add("rows")
        document.getElementById("board").appendChild(row)

        for (let c = 0; c < width; c++) {
            //<span id="0-0" class="tile"></span>
            let tile = document.createElement("span"); //create a new html element
            tile.id = r.toString() + "-" + c.toString(); //generate id (0-0, 1-0)
            tile.classList.add("tile"); //generate class
            tile.innerText = "";
            document.getElementById(`row${r.toString()}`).appendChild(tile); //find board id and insert tile document
        }
    }

    // Listen for Key Press
    document.addEventListener("keyup", (e) => {
        if(gameOver) return; 
        
        // alert(e.code) // The KeyboardEvent.code tells you what key was pressed  
        // we only allow certain keys to be pressed within width range
        if ("KeyA" <= e.code && e.code <= "KeyZ") {
            if (col < width) {
                let currTile = document.getElementById(row.toString() + "-" + col.toString());
                if (currTile.innerText === "") {
                    currTile.innerText = e.code[3]; // e.code returns 4 character string (KeyA). "A" is at index 3
                    col += 1; // move to next tile 
                    currWord += e.code[3] // set current word
                }
            }
        }

        else if (e.code === "Backspace") {
            if (0 < col && col <= width) {
                col -= 1;
                currWord = currWord.slice(0, -1) // edit current word
            }
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            currTile.innerText = "";
        }

        else if (e.code === "Enter" && col === width) {
            isValid(currWord, todaysWord)
        }

        if (!gameOver && row === height) {
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
    })
    
};

function isValid(checkWord, todaysWord) {
    // check if current word is valid
    const options = {
        method: 'GET',
        url: 'https://wordsapiv1.p.rapidapi.com/words/',
        params: { letterPattern: `^${checkWord.toLowerCase()}$`},
        headers: {
            'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
            'x-rapidapi-key': 'c0f74f441cmsh567cad65aabece8p1aad19jsn4142e09a557d'
        }
        };
    
    axios.request(options).then(function (response) {
        // if the word exist in the dictionary
        if (response.data.results.total === 1) {
            update(todaysWord)
            row += 1; // start a new row
            col = 0;  // start at 0 for new word
            currWord = "";
        } else {
            let currRow = document.getElementById("row" + row.toString())
            currRow.classList.add("invalid")
        }
    }).catch(function (error) {
        console.error(error);
    });
};

function update(word) {
    let correct = 0;
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        // is it in the right position?
        if (word[c] === letter) {
            currTile.classList.add("correct");
            correct += 1;
        } // is it in the word? 
        else if (word.includes(letter)) {
            currTile.classList.add("present");
        } // not in the word
        else {
            currTile.classList.add("absent");
        }
        
        if (correct === width) {
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
    }
};