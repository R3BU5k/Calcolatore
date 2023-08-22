//script tema manuale
const themeToggle = document.getElementById('theme-toggle');
const themeStyle = document.getElementById('theme-style');

themeToggle.addEventListener('click', () => {
if (themeStyle.getAttribute('href') === 'styles/light.css') {
    themeStyle.href = 'styles/dark.css';
} else {
    themeStyle.href = 'styles/light.css';
}
});

function validateInput(input) {
  input.value = input.value.replace(/[^0-9.,]/g, '');
}
function validateInput1(input) {
  input.value = input.value.replace(/[^0-9.]/g, '');
}
function validateInput2(input) {
  input.value = input.value.replace(/[^0-9]/g, '');
}

function calculate() {
var input = document.getElementById("numbers").value;
var numbers = input.split(",");
var sum = 0;

/*prelevo media desiderata*/
var valore = +document.getElementById("media").value;
/*prelevo valore massimo ottenibile*/
var vmax = +document.getElementById("vmax").value;

for (var i = 0; i < numbers.length; i++) {
    sum += parseFloat(numbers[i]);
}
var average = sum / numbers.length;
document.getElementById("result").innerHTML = average.toFixed(2);

document.getElementById("alternativa").innerHTML = "";

if(valore >= vmax){
    document.getElementById("quanti").innerHTML = "Non è possibile richiedere una media pari o superiore a vmax.";

    document.getElementById("errore").innerHTML = "";
    valore = vmax - 0.01;
}else{
    if(average >= valore){ //media sopra la quale la funzione non svolge calcoli
        /*inizializzo div vuoti*/	
        document.getElementById("quanti").innerHTML = "Non servono altri voti";

        document.getElementById("errore").innerHTML = "";
    }else{
 
        /*inizializzo array dei voti mancanti e array contatore voti*/
        const serve = [];
        var i = new Array(2);
        for(var j = 0; j <= 2; j++){
            i[j] = 1;
            serve[j] = 1;
        }
        /*calcolo 1° quantità (i) x voti (serve)*/
        serve[0] = (valore*(numbers.length+i[0])-sum)/i[0];
        while(serve[0] > vmax || serve[0] < 0){
            if(i[0] == 1000){
                document.getElementById("quanti").innerHTML = "";
                document.getElementById("errore").innerHTML = "L'approssimazione è troppo grande!";               
                return false;
            }
            i[0] +=1;
            serve[0] = (valore*(numbers.length+i[0])-sum)/i[0];
        }
        /*calcolo n quantità (j) x voti (serve) dopo la prima calcolata sopra*/	
        for(j = 1; j <= 3; j++){
            i[j] = i[j-1] + 1;
            serve[j] = (valore*(numbers.length+i[j])-sum)/i[j];
                while(serve[j] > vmax){
                    serve[j] = (valore*(numbers.length+i[j])-sum)/i[j];
                    if(serve[j] > vmax){
                        i[j] += 1;
                    }
            }
        }

        /*ciclo arrotondamento a voto standard per eccesso*/
        for (var arr = 0; arr < 4; arr++) {
        var a = Math.floor(serve[arr]);

        if( serve[arr] - a > 0.01 && serve[arr] - a <= 0.15){
            serve[arr] = a + 0.15;
        }
        else if( serve[arr] - a > 0.16 && serve[arr] - a <= 0.5){
            serve[arr] = a + 0.5;
        }
        else if( serve[arr] - a > 0.51 && serve[arr] - a <= 0.85){
            serve[arr] = a + 0.85;
        }
        else if( serve[arr] - a > 0.86 && serve[arr] - a <= 1){
            serve[arr] = a + 1.0;
        }
        }

        /*stampa 1° quantità x voti se non uguale alla media*/	
        if(serve[0] != average){
            document.getElementById("quanti").innerHTML = i[0].toFixed(0) + " volte " +  serve[0].toFixed(2) + "<br><br>";
        }else{
            document.getElementById("quanti").innerHTML = "Non servono altri voti.";
            document.getElementById("alternativa").innerHTML = "";
        }

        /*stampa delle successive quantità x voti se non uguali alla precedente*/
        var write = 1;
        while(write < 3){ //3 e' il numero totale di quantita' di voti compresa la prima (sopra)
            if(serve[write] != serve[write-1]){
                document.getElementById("quanti").innerHTML += "Oppure <br><br>" + i[write].toFixed(0) + " volte " + serve[write].toFixed(2) + "<br><br>";
            }else{
                document.getElementById("errore").innerHTML = "";
                document.getElementById("alternativa").innerHTML = "";
            }
            write += 1;
        }
        /*document.getElementById("alternativa").innerHTML = ""; //svuota il div con le varianti per evitare sovrascritture
        if(i[0] > 2 && i[0] < 5 && serve[0] < vmax){
        let nums = new Array(10);
        let test = 0, counter = 0;
        var save = new Array(10);
        for(let m = 0; m < i[0]; m++){
            nums[m] = 1;
        }
        var diff = 0;
        while (counter != 3) //quante varianti della somma da mostrare (3)
        {
            for (let counter = 0; counter < i[0]; counter++)
            {
                test += nums[counter];
            }
            if(test <= (valore*(numbers.length+i[0])-sum)-0.75 && test <= (valore*(numbers.length+i[0])-sum)+0.75){
                for (let counter = 0; counter < i[0]; counter++)
                {
                    save[counter] = nums[counter];
                }
            document.getElementById("alternativa").innerHTML += "Con " + i[0] + " voti:";
                save.forEach(el => {
                    
                    document.getElementById("alternativa").innerHTML +=`<div>${el}</div>`;
                });
                counter++;
            }else{
                test = 0;
            }
            nums[0] += 0.75;
            if(nums[0] > vmax){
                diff = nums[0] - vmax;
            }
            for (let counter = 0; counter < i[0]; counter++)
            {
                if(nums[counter] == vmax+diff){
                    nums[counter] = diff;
                    nums[counter+1] += diff;
                }           
            } 
        }
        document.getElementById("alternativa").innerHTML += "<br>"; // a capo dopo la prima serie di alternative
        }

        var prova = 1;
        while(prova < 3){ //3 e' il numero totale di quantita' di indici diversi per le alternative compreso il primo (sopra) esempio: Con 2,3,4 voti
            if(i[prova] > 2 && i[prova] < 6 && serve[prova] < vmax && serve[prova] != serve[prova-1]){
                let nums2 = new Array(10);
                let test2 = 0, counter2 = 0;
                var save2 = new Array(10);
                for(let m2 = 0; m2 < i[prova]; m2++){
                    nums2[m2] = 1;
                }

                while (counter2 != 15) //quante varianti della somma da mostrare (3)
                {
                    for (let counter2 = 0; counter2 < i[prova]; counter2++)
                    {
                        test2 += nums2[counter2];
                    }
                    if(test2 >= (valore*(numbers.length+i[prova])-sum)-0.75 && test2 <= (valore*(numbers.length+i[prova])-sum)+0.75){
                        for (let counter2 = 0; counter2 < i[prova]; counter2++)
                        {
                            save2[counter2] = nums2[counter2];
                        }
                    document.getElementById("alternativa").innerHTML += "Con " + i[prova] + " voti:";
                        save2.forEach(el => {
                            
                            document.getElementById("alternativa").innerHTML +=`<div>${el}</div>`;
                        });
                        counter2++;
                    }else{
                        test2 = 0;
                    }
                    nums2[0] += 0.75;
                    if(nums2[0] > vmax){
                        diff = nums2[0] - vmax;
                    }
                    for (let counter2 = 0; counter2 < i[prova]; counter2++)
                    {
                        if(nums2[counter2] == vmax+diff){
                            nums2[counter2] = diff;
                            nums2[counter2+1] += diff;
                        }           
                    }   
                }
                }
                document.getElementById("alternativa").innerHTML += "<br>";
            prova += 1;
        }*/
    }
}
}

//mostra/nascondi div "alternativa", alternative somme
function show() {
    var show1 = document.getElementById("alternativa");

    if (show1.style.display === "block") {
      show1.style.display = "none";
    } else {
      show1.style.display = "block";
    }
}
//Select button by id
const MyButton = document.getElementById('button');
//Add on click listener for button
MyButton.addEventListener('click', function() {
    //Select (h1) heading by id, and then change it's value to (bananas)
    document.getElementById('testo1').innerText = "La media dei numeri inseriti è:"
    document.getElementById('testo2').innerText = "Per arrivare alla media richiesta mancano:"
})

/*Disabilita ispezione codice sorgente */
document.onkeydown = (e) => {
    if (e.key == 123) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.key == 'I') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.key == 'C') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.key == 'J') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.key == 'U') {
        e.preventDefault();
    }
};
