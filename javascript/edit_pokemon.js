var select = document.getElementById("monlist");
var input = document.getElementById("moninput");
var regionSelect  = document.getElementById("regionlist");
var regionInput = document.getElementById("regioninput");
var text = document.getElementById("text");
var numberText = document.getElementById("number");
var typesText = document.getElementById("types");
var weaknesses1Text = document.getElementById("weakness1");
var weaknesses2Text = document.getElementById("weakness2");

for(var j = 1; j <= 34; j++){
    let string = "https://pokeapi.co/api/v2/version/" + j.toString();
    if(j !== 19 && j !== 20){
        $.getJSON(string, function (data) {
           var region = document.createElement("option");
           region.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
           region.value = data.name.charAt(0).toUpperCase() + data.name.slice(1);
           regionSelect.append(region);
        });
    }
}

for(var i = 1; i <= 898; i++){
    let string = "https://pokeapi.co/api/v2/pokemon/" + i.toString();
    $.getJSON(string, function(data) {
        var mon = document.createElement("option");
        let textContent = "";
        for(let i = 0; i < data.types.length; i++){
            textContent += data.types[i].type.name.charAt(0).toUpperCase() + data.types[i].type.name.slice(1) + " "
        }
        mon.textContent = textContent;
        mon.value = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        select.append(mon);
    });
}
function addPokemon(){
    let string = "https://pokeapi.co/api/v2/pokemon/" + input.value.toLowerCase();
    $.ajax({
        url: string,
        async: false,
        dataType: 'json',
        success: function (data) {
            var numMons = parseInt(numberText.innerHTML.substring(numberText.innerHTML.length-1, numberText.innerHTML.length));
            if(numMons !== 6){
                numMons++;
                moreTypes = Array()
                for(let i = 0; i < data.types.length; i++){
                    moreTypes.push(data.types[i].type.name);
                }
                let addition = "<br>" + input.value;
                for(let i = 0; i < moreTypes.length; i++){
                    addition += " " + moreTypes[i];
                }
                if(regionInput.value.length > 0){
                    string = "https://pokeapi.co/api/v2/" + input.value.toLowerCase() + "/encounters";
                }
                console.log(addition);
                numberText.innerHTML = "Number of Pokemon: " + numMons.toString();
                text.innerHTML += addition;
                updateTypes();
                updateWeaknesses();
                updateColors(text, true);
                updateColors(typesText, false);
                updateColors(weaknesses1Text, false);
                updateColors(weaknesses2Text, false);
            }
        }
    });
    string = "https://pokeapi.co/api/v2/pokemon-species/" + input.value.toLowerCase();
    let pokemon = "";
    $.ajax({
        url: string,
        async: false,
        dataType: 'json',
        success: function (data){
            $.ajax({
                url: data.evolution_chain.url,
                async: false,
                dataType: 'json',
                success: function (data2){
                    pokemon = data2.chain.species.name;
                }
            });
        }
    });
    string = "https://pokeapi.co/api/v2/pokemon/" + pokemon + "/encounters";
    $.ajax({
        url: string,
        async: false,
        dataType: 'json',
        success: function (data) {
            let locations = Array();
            for(let i = 0; i < data.length; i++){
                console.log(data[i]);
                for(let j = 0; j < data[i].version_details.length; j++){
                    if(data[i].version_details[j].version.name === regionInput.value.toLowerCase()){
                        $.ajax({
                            url: data[i].location_area.url,
                            async: false,
                            dataType: 'json',
                            success: function (data2) {
                                locations.push(data2.location.name);
                            }
                        });
                        break;
                    }
                }
            }
            locations = [...new Set(locations)];
            for(let i = 0; i < locations.length; i++){
                text.innerHTML += " " + locations[i];
            }
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
        updateColors(text, true);
        updateColors(typesText, false);
        updateColors(weaknesses1Text, false);
        updateColors(weaknesses2Text, false);
    }
}

function updateTypes(){
    let listOfTypes = ["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
    let types = Array()
    let tempText = text.innerText.split("\n");
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
        if(listOfTypes.includes(types[i].toLowerCase())){
            typesTextString += types[i] + "<br>";
        }
    }
    typesText.innerHTML = typesTextString;
}

function updateWeaknesses(){
    let tempMonText = text.innerText.split("\n");
    let tempTypeText = typesText.innerText.split("\n");
    let weakness1 = Array();
    let weakness2 = Array();
    let listOfTypes = ["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
    for(let i = 0; i < listOfTypes.length; i++){
        for(let j = 0; j < tempMonText.length; j++){
            let tempMonText2 = tempMonText[j].split(" ");
            let tempTypes = Array();
            for(let k = 1; k < tempMonText2.length; k++){
                tempTypes.push(tempMonText2[k].toLowerCase());
            }
            if(isWeak(listOfTypes[i], tempTypes)){
                console.log(listOfTypes[i]);
                let tempArray = [listOfTypes[i]]
                let isCovered = false;
                for(let k = 0; k < tempTypeText.length; k++){
                    if(isWeak(tempTypeText[k].toLowerCase(), tempArray)){
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

function updateColors(object, includespace){
    let listOfTypes = ["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
    let str = object.innerHTML;
    let tempRegexString = "";
    if(includespace){
        for(let i = 0; i < listOfTypes.length; i++){
            tempRegexString += " " + listOfTypes[i].toLowerCase() + "| " + listOfTypes[i].toUpperCase() + "|";
        }
    } else {
        for(let i = 0; i < listOfTypes.length; i++){
            tempRegexString += listOfTypes[i].toLowerCase() + "|" + listOfTypes[i].toUpperCase() + "|";
        }
    }
    let reg = RegExp(tempRegexString.substring(0, tempRegexString.length-1), "ig");
    let toStr = String(reg);
    let color = (toStr.replace('\/g', '|')).substring(1);
    let colors = color.split("|");

    str = colorChecker(str, "normal", colors, "#A8A77A", includespace);
    str = colorChecker(str, "fire", colors, "#EE8130", includespace);
    str = colorChecker(str, "water", colors, "#6390F0", includespace);
    str = colorChecker(str, "grass", colors, "#7AC74C", includespace);
    str = colorChecker(str, "electric", colors, "#F7D02C", includespace);
    str = colorChecker(str, "ice", colors, "#96D9D6", includespace);
    str = colorChecker(str, "poison", colors, "#A33EA1", includespace);
    str = colorChecker(str, "fighting", colors, "#C22E28", includespace);
    str = colorChecker(str, "ground", colors, "#E2BF65", includespace);
    str = colorChecker(str, "flying", colors, "#A98FF3", includespace);
    str = colorChecker(str, "psychic", colors, "#F95587", includespace);
    str = colorChecker(str, "bug", colors, "#A6B91A", includespace);
    str = colorChecker(str, "rock", colors, "#B6A136", includespace);
    str = colorChecker(str, "ghost", colors, "#735797", includespace);
    str = colorChecker(str, "dragon", colors, "#6F35FC", includespace);
    str = colorChecker(str, "dark", colors, "#705746", includespace);
    str = colorChecker(str, "steel", colors, "#B7B7CE", includespace);
    str = colorChecker(str, "fairy", colors, "#D685AD", includespace);

    object.innerHTML = str;
}
function colorChecker(str, type, colors, code, includespace){
    if(includespace){
        if(colors.indexOf(" " + type.toLowerCase()) > -1){
            let regex = new RegExp(" " + type.toLowerCase(), "g");
            str = str.replaceAll(regex, ' <span style="color:' + code + ';">' + type.toLowerCase() +'</span>');
        }
        if(colors.indexOf(" " + type.toUpperCase()) > -1){
            let regex = new RegExp(" " + type.toUpperCase(), "g");
            str = str.replaceAll(regex, ' <span style="color:' + code + ';">' + type.toLowerCase() +'</span>');
        }
    } else {
        if(colors.indexOf(type.toLowerCase()) > -1){
            let regex = new RegExp(type.toLowerCase(), "g");
            str = str.replaceAll(regex, '<span style="color:' + code + ';">' + type.toLowerCase() +'</span>');
        }
        if(colors.indexOf(type.toUpperCase()) > -1){
            let regex = new RegExp(type.toUpperCase(), "g");
            str = str.replaceAll(regex, '<span style="color:' + code + ';">' + type.toLowerCase() +'</span>');
        }
    }
    return str;
}