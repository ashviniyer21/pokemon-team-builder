var select = document.getElementById("list");
var input = document.getElementById("input");
var text = document.getElementById("text");
var numberText = document.getElementById("number");
var typesText = document.getElementById("types");
var weaknesses1Text = document.getElementById("weakness1");
var weaknesses2Text = document.getElementById("weakness2");

for(var i = 1; i <= 898; i++){
    var string = "https://pokeapi.co/api/v2/pokemon/" + i.toString();
    $.getJSON(string, function(data) {
        var mon = document.createElement("option");
        mon.textContent = data.name;
        mon.value = data.name;
        select.append(mon);
    });
}
function addPokemon(){
    let string = "https://pokeapi.co/api/v2/pokemon/" + input.value
    $.getJSON(string, function (data){
        var numMons = parseInt(numberText.innerHTML.substring(numberText.innerHTML.length-1, numberText.innerHTML.length));
        if(numMons !== 6){
            numMons++;
            moreTypes = Array()
            for(let i = 0; i < data.types.length; i++){
                moreTypes.push(data.types[i].type.name);
            }
            var addition = "<br>" + input.value;
            for(let i = 0; i < moreTypes.length; i++){
                addition += " " + moreTypes[i];
            }
            console.log(addition);
            numberText.innerHTML = "Number of Pokemon: " + numMons.toString();
            text.innerHTML += addition;
            updateTypes();
            updateWeaknesses();
        }
    });
}

function deletePokemon(){
    let numMons = parseInt(numberText.innerHTML.substring(numberText.innerHTML.length-1, numberText.innerHTML.length));
    if(numMons !== 0){
        numMons--;
        numberText.innerHTML = "Number of Pokemon: " + numMons.toString();
        text.innerHTML = text.innerHTML.substring(0, text.innerHTML.lastIndexOf("<br>"));
        updateTypes();
        updateWeaknesses();
    }
}

function updateTypes(){
    let types = Array()
    let tempText = text.innerHTML.split("<br>");
    for(let i = 0; i < tempText.length; i++){
        let tempText2 = tempText[i].split(" ");
        console.log(tempText2);
        for(let j = 1; j < tempText2.length; j++){
            types.push(tempText2[j]);
        }
    }
    types = [...new Set(types)];
    let typesTextString = "";
    for(let i = 0; i < types.length; i++){
        typesTextString += types[i] + "<br>";
    }
    typesText.innerHTML = typesTextString;
}

function updateWeaknesses(){
    let tempMonText = text.innerHTML.split("<br>");
    let tempTypeText = typesText.innerHTML.split("<br>");
    let weakness1 = Array();
    let weakness2 = Array();
    let listOfTypes = ["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

    for(let i = 0; i < listOfTypes.length; i++){
        for(let j = 0; j < tempMonText.length; j++){
            let tempMonText2 = tempMonText[j].split(" ");
            let tempTypes = Array();
            for(let k = 1; k < tempMonText2.length; k++){
                tempTypes.push(tempMonText2[k]);
            }
            if(isWeak(listOfTypes[i], tempTypes)){
                console.log(listOfTypes[i]);
                let tempArray = [listOfTypes[i]]
                let isCovered = false;
                for(let k = 0; k < tempTypeText.length; k++){
                    if(isWeak(tempTypeText[k], tempArray)){
                        isCovered = true;
                        break;
                    }
                }
                if(isCovered){
                    weakness1.push(listOfTypes[i]);
                } else {
                    weakness2.push(listOfTypes[i]);
                }
                break;
            }
        }
    }
    let weaknessString = "";
    for(let i = 0; i < weakness1.length; i++){
        weaknessString += weakness1[i] + "<br>";
    }
    weaknesses1Text.innerHTML = weaknessString;

    weaknessString = "";
    for(let i = 0; i < weakness2.length; i++){
        weaknessString += weakness2[i] + "<br>";
    }
    weaknesses2Text.innerHTML = weaknessString;
}

//TODO: Fix this function
function isWeak(attackingType, pokemonTypes){
    let typeData;
    $.ajax({
        url: 'json/typechart.json',
        async: false,
        dataType: 'json',
        success: function (data) {
            for(let i = 0; i < data.length; i++){
                if(data[i].name === attackingType){
                    typeData = data[i];
                }
            }
        }
    });
    let mult = 1;
    if(typeData != null){
        for(let i = 0; i < pokemonTypes.length; i++){
            if(typeData.strengths.includes(pokemonTypes[i])){
                mult *= 2;
            } else if(typeData.weaknesses.includes(pokemonTypes[i])){
                mult *= 0.5;
            } else if(typeData.immunes.includes(pokemonTypes[i])){
                mult = 0;
            }
        }
    }
    return mult > 1;
}