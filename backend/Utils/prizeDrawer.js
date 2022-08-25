export default function drawPrize(prizeContestants){
    const winnerNumber = Math.round(Math.random()*9999)+1
    let winnerCountDown = winnerNumber
    for(let i = 0; i < prizeContestants.length; i++){
        if(prizeContestants[i].win_chance >= winnerCountDown){
            return prizeContestants[i].name
        }
        else{
            winnerCountDown -= prizeContestants[i].win_chance
        }
    }
}