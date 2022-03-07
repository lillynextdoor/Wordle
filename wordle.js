
let height = 6; //number of guesses
let width = 5; //length of words

let row = 0; //current guess (attempt #)
let col = 0; //current letter for that attempt

let gameOver = false;
let word = "SQUID";

window.onload = async function() { // when a page loads, call this function
    initialize();
};

async function initialize() {
    // generate today's word
    let word = "";

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
        word = response.data.word.toUpperCase();
        console.log('오늘의단어', word);
    }).catch(function (error) {
        console.error(error);
    });

    // create the board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            //<span id="0-0" class="tile"></span>
            //use javascript so that we can use for loop to create multiple tags instead of writing one by one 
            let tile = document.createElement("span"); //create a new html element
            tile.id = r.toString() + "-" + c.toString(); //generate id (0-0, 1-0)
            tile.classList.add("tile"); //generate class
            tile.innerText = "";
            document.getElementById("board").appendChild(tile); //find board id and insert tile document
        }
    }

    // Listen for Key Press
    document.addEventListener("keyup", (e) => {
        if(gameOver) return; 
        
        // alert(e.code) // The KeyboardEvent.code tells you what key was pressed  
        // we only allow certain keys to be pressed
        if ("KeyA" <= e.code && e.code <= "KeyZ") {
            if (col < width) {
                let currTile = document.getElementById(row.toString() + "-" + col.toString());
                if (currTile.innerText === "") {
                    currTile.innerText = e.code[3]; // e.code returns 4 character string (KeyA). "A" is at index 3
                    col += 1;
                }
            }
        }

        else if (e.code === "Backspace") {
            if (0 < col && col <= width) {
                col -= 1;
            }
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            currTile.innerText = "";
        }

        else if (e.code === "Enter" && col === width) {
            update(word);
            row += 1; // start new row
            col = 0;  // start at 0 for new row
        }

        if (!gameOver && row === height) {
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
    })
    
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





