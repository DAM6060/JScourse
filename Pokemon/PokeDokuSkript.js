//Task List
//1 Create BaseFunctionality- Completed
//2 Create Options For User To Choose From - Pending
  //2.1 Difficulty Level - Pending
  //2.2 Generation Filter - Pending
//3 Make it Pretty - Pending
// Skript for the PokeDoku project
const baseURl = "https://pokeapi.co/api/v2/";
const correctAsnwers = {};

window.addEventListener("load", populateTypes);
window.addEventListener("load", addEventListenersToInputsFields);

function addEventListenersToInputsFields() {
    const inputFields = document.querySelectorAll("input");
    inputFields.forEach(inputField => {
        inputField.addEventListener("blur", checkIfInputIsCorrect);
    });
}


function checkIfInputIsCorrect(event) {
    //get the value of the input field
    const inputValue = event.target.value.toLowerCase();
    
    //get corordinates of the input field
    const row = event.target.getAttribute("data-row");
    const column = event.target.getAttribute("data-column");
    //get the value of the column and row from the table
    const columnTypeValue = document.getElementById("column-type-" + column).textContent;
    const rowTypeValue = document.getElementById("row-type-" + row).textContent;
    //check if the value is correct based on the the arrays
    if (correctAsnwers[columnTypeValue].includes(inputValue) && correctAsnwers[rowTypeValue].includes(inputValue)) {
        event.target.style.backgroundColor = "green";
    } else {
        event.target.style.backgroundColor = "red";
    }
}
async function  populateTypes() {
    let typesSet = new Set();
    //We can take this while fucntion out of the populateTypes function and use it in the other functions
    while (typesSet.size < 6) {
        let randomTypeIndex = Math.floor(Math.random() * 18) + 1;
        let randomType = await fetch(baseURl + "type/" + randomTypeIndex)
        .then(response => response.json())
        .then(data => {
            return data.name;
        });
        typesSet.add(randomType);
    }
    let typesArray = Array.from(typesSet);
    
    
    //populate posible results in global varbles
    for (let i = 0; i < typesArray.length; i++) {        
        const promise = await fetch(baseURl + "type/" + typesArray[i])
        .then(response => response.json())
        .then(data => {
            //think about optimizing so that we do not take pokemon with 1 type
            //gonna be annoying cuz we have to do another fetch request since we only get the name of the pokemon
            return data.pokemon.map(pokemon => pokemon.pokemon.name);
        }).then(pokemonArray => {
            correctAsnwers[typesArray[i]] = pokemonArray;
        });       
    }
    
    //check if combination of types is possible
    if (!correctAsnwers[typesArray[0]].some(pokemon => correctAsnwers[typesArray[3]].includes(pokemon))
        || !correctAsnwers[typesArray[0]].some(pokemon => correctAsnwers[typesArray[4]].includes(pokemon))
        || !correctAsnwers[typesArray[0]].some(pokemon => correctAsnwers[typesArray[5]].includes(pokemon))
        || !correctAsnwers[typesArray[1]].some(pokemon => correctAsnwers[typesArray[3]].includes(pokemon))
        || !correctAsnwers[typesArray[1]].some(pokemon => correctAsnwers[typesArray[4]].includes(pokemon))
        || !correctAsnwers[typesArray[1]].some(pokemon => correctAsnwers[typesArray[5]].includes(pokemon))
        || !correctAsnwers[typesArray[2]].some(pokemon => correctAsnwers[typesArray[3]].includes(pokemon))
        || !correctAsnwers[typesArray[2]].some(pokemon => correctAsnwers[typesArray[4]].includes(pokemon))
        || !correctAsnwers[typesArray[2]].some(pokemon => correctAsnwers[typesArray[5]].includes(pokemon))) {
        console.log("Not possible");
        populateTypes();        
    }
    
    
    const column1 = document.getElementById("column-type-1");
    column1.textContent = typesArray[0];
    
    const column2 = document.getElementById("column-type-2");
    column2.textContent = typesArray[1];
    
    const column3 = document.getElementById("column-type-3");
    column3.textContent = typesArray[2];
    
    const row1 = document.getElementById("row-type-1");
    row1.textContent = typesArray[3];
    
    const row2 = document.getElementById("row-type-2");
    row2.textContent = typesArray[4];
    
    const row3 = document.getElementById("row-type-3");
    row3.textContent = typesArray[5];
} 


