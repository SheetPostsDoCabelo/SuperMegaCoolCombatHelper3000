const bamvrosCA = 17
const borivikCA = 19
const alastairCA = 17
const danteCA = 24
const ragCA = 16

const attack1 = 6
const attack2 = 6

const attack1Name = "Slash"
const attack2Name = "Bolt"

let currentChar = ""

function toggleCheck(x){
    let n1
    let n2
    let classClicked = x.classList[0]
    
    if(classClicked=="advantage"){n1 = 0; n2 = 1}
    if(classClicked=="disadvantage"){n1 = 1; n2 = 0}

    
    let thisBox = x.parentElement.children[n1]
    let otherBox = x.parentElement.children[n2]

    //toggle
    if($(x).is(":checked")){
        //unmark
        $(otherBox).prop('checked', false)
        //style
        warnRollModsStyle(classClicked, x)
    }

    if(!($(x).is(":checked"))){
        classClicked = "none"
        //style
        warnRollModsStyle(classClicked, x)
    }
}

const roll20 = () => {return Math.ceil(Math.random()*20)} 

const CharacterCA = (CharacterName) =>{
    if (CharacterName == 'Bamvros'){return bamvrosCA}
    if (CharacterName == 'Borivik'){return borivikCA}
    if (CharacterName == 'Alastair'){return alastairCA}
    if (CharacterName == 'Dante'){return danteCA}
    if (CharacterName == "Rag'Oth'Er"){return ragCA}
}


const checkCA = (roll, mod, CA) =>{
    let result = roll + mod
    if (CA > result){return 0}
        else{return 1}
}

function calculateAttacks (x) {
    let CharacterName = x.parentElement.children[1].children[0].innerHTML
    let CA = CharacterCA(CharacterName)

    currentChar = CharacterName
    if(currentChar=="Rag'Oth'Er"){currentChar="Rag"}

    console.log ("Target:",CharacterName)
    console.log (CA+" CA")

   let Slashes = x.parentElement.children[2].children[0].children[0].children[2]
   let Bolts = x.parentElement.children[2].children[0].children[1].children[2]

   let modSlashes = "none"
   let modBolts = "none"

   let advBoxSlashes = x.parentElement
                            .children[2]
                                .children[0]
                                    .children[0]
                                        .children[1]
                                            .children[0]

   let disBoxSlashes = x.parentElement.children[2].children[0].children[0].children[1].children[1]
   if($(advBoxSlashes).is(":checked")){modSlashes = "advantage"}
   if($(disBoxSlashes).is(":checked")){modSlashes = "disadvantage"}

   let advBoxBolts = x.parentElement.children[2].children[0].children[1].children[1].children[0]
   let disBoxBolts = x.parentElement.children[2].children[0].children[1].children[1].children[1]
   if($(advBoxBolts).is(":checked")){modBolts = "advantage"}
   if($(disBoxBolts).is(":checked")){modBolts = "disadvantage"}

   if(Slashes.value > 0){
        showResults(hitCalculation(CA,modSlashes,Slashes.value,attack1,attack1Name), x, modSlashes, attack1Name)
    }

   if(Bolts.value > 0){
        showResults(hitCalculation(CA,modBolts,Bolts.value,attack2,attack2Name), x, modBolts, attack2Name)
    }

    $(Slashes).val('')
    $(Bolts).val('')
}

const hitCalculation = (CA,attackMod,nOfAttacks,attack,attackName) =>{
    let mod = attack
    let results = []

    console.log('checking modifier:', attackMod)
    console.log('calculating', nOfAttacks, attackName,'Atacks')

    for(i=0;i<nOfAttacks;i++){ 
        if (attackMod == "none") {
            let roll = roll20();
            reportRolls(roll, mod);
            if (roll != 1 && roll != 20) {
                let didItHit = checkCA(roll, mod, CA)
                if (didItHit == 0) {
                    results.push("miss")
                } else {
                    results.push("hit")
                }
            } else {
                if (roll == 20) { results.push("critHit"); }
                if (roll == 1) { results.push("critMiss");}
            }
        }

        if (attackMod == "advantage") {
            let roll = roll20();
            let roll2 = roll20();
            if (roll == 20 || roll2 == 20) {
                results.push("critHit"); 
            } else {
                if (roll == 1 && roll2 == 1) {
                    results.push("critMiss");
                } else {
                    let didItHit = checkCA(roll, mod, CA) + checkCA(roll2, mod, CA)
                    if (didItHit == 0) {
                        results.push("miss")
                    } else {
                        results.push("hit")
                    }
                }
            } reportRolls(roll, mod);reportRolls(roll2, mod);console.log('- - -');
        }

        if (attackMod == "disadvantage") {
            let roll = roll20();
            let roll2 = roll20();
            reportRolls(roll, mod);reportRolls(roll2, mod);console.log('- - -');
            if (roll == 1 || roll2 == 1) {
                results.push("critMiss");
            }
            else {
                if (roll == 20 && roll2 == 20) { results.push("critHit");}
                else {
                    let didItHit = checkCA(roll, mod, CA) + checkCA(roll2, mod, CA)
                    if (didItHit < 2) {
                        results.push("miss")
                    } else {
                        results.push("hit")
                    }
                }
            }
        }

     }
    console.log(results)   
    return results
}

const showResults = (results, x, mod, typeOfAttack) => {
    let mainParent = x.parentElement.parentElement.parentElement.parentElement.parentElement
    let resultsToShow = " "
    let cardTitle = typeOfAttack + " Attacks"

    updateVisibleWindows(currentChar, typeOfAttack)

    results.forEach((result) => {
            if(result == 'hit'){resultsToShow += "<span class='hit btn btn-success'>HIT</span>"}           
            if(result == 'miss'){resultsToShow += "<span class='miss btn btn-danger'>miss</span>"}
            if(result == 'critHit'){resultsToShow += "<span class='crithit btn btn-success'>CRIT</span>"}           
            if(result == 'critMiss'){resultsToShow += "<span class='critmiss btn btn-danger'>CRIT</span>"}
            }
         ) 

    $(mainParent).append(
            `
        <div class="card mt-3 ml-3 shadow" id="${currentChar}${typeOfAttack}">
            <div class="card-body ${mod}FinalCard">
                 <h4 class="card-title">${cardTitle}</h4>
                 <p class="card-text">${resultsToShow}</p>
            </div>
        </div>
            `
          ) 
}

const updateVisibleWindows = (CharacterName, typeOfAttack) => {
    let idName = '#' + CharacterName + typeOfAttack
   $(idName).remove()
}

const warnRollModsStyle = (classClicked, element) =>{

    console.log(classClicked)

    box = element.parentElement.parentElement

    modText = element.parentElement.parentElement.children[3]

    if(classClicked == "advantage"){
        $(box).addClass('advantage')
        $(box).removeClass('disadvantage')
        $(modText).html("Vantagem")
    }
    if(classClicked == "disadvantage"){
        $(box).addClass('disadvantage')
        $(box).removeClass('advantage')
        $(modText).html("Desvantagem")
    }
    if(classClicked == "none"){
        $(box).removeClass('disadvantage')
        $(box).removeClass('advantage')
        $(modText).html("")
    }
}

const reportRolls = (roll, mod) =>{
    console.log('result is '+ (roll+mod) +' ('+roll+'+'+mod+')')
}

