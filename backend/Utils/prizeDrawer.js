export default function drawPrize(prizeContestants){
    const winnerNumber = Math.round(Math.random()*9999)+1
    let winnerCountDown = winnerNumber
    prizeContestants.foreach(contestant => {
        if(contestant.win_chance >= winnerCountDown){
            return contestant
        }
        else{
            winnerCountDown -= contestant.win_chance
        }
    })
}