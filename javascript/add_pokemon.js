var select = document.getElementById("list");
var input = document.getElementById("input");
var mons = 0;
var text = document.getElementById("text");
for(var i = 1; i <= 898; i++){
    var string = "https://pokeapi.co/api/v2/pokemon/" + i.toString();
    $.getJSON(string, function(data) {
        var mon = document.createElement("option");
        mon.textContent = data.name;
        mon.value = data.name;
        console.log(data.name);
        select.append(mon);
    });
}
function addPokemon(){
    var string = "https://pokeapi.co/api/v2/pokemon/" + input.value
    $.getJSON(string, function (data){
        types = Array()
        for(let i = 0; i < data.types.length; i++){
            types.push(data.types[i].type.name);
        }
        var addition = "<br>" + input.value;
        // console.log("Hello" + types.length)
        for(let i = 0; i < types.length; i++){
            addition += " " + types[i];
        }
        text.innerHTML += addition;
    });
}