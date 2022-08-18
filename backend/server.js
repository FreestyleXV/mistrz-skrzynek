const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3001;
const Contents = [{name:"MAJONEZ", rarity:"L", img:"majonez.png"}, {name:"KETCHUP", rarity:"R", img:"ketchup.png"}, {name:"MUSZTARDA", rarity:"C", img:"musztarda.png"}, {name:"SOS BARBEQUE", rarity:"X", img:"sos_barbeque.png"}, {name:"CHRZAN", rarity:"C", img:"chrzan.png"}, {name:"SOS 1000 WYSP", rarity:"E", img:"sos_1000_wysp.png"}]

const server = http.createServer((req, res) => {
  console.log(req.url)
  let url = req.url.split("/")
  if(url[1] == 'contents'){
    let rouletteLength = Math.round(Math.random()*2) + 30
    let rouletteContents = []
    for(let i = 0; i < rouletteLength; i++){
      rouletteContents.push(Math.round(Math.random()*(Contents.length-1)))
    }
    console.log('pobrano dane')
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    res.write(JSON.stringify({contents:Contents, length:rouletteLength, roulette:rouletteContents}))
    res.end()
  }
  else if(url[1] == "image") {
    var img = fs.readFileSync(`./images/${url[2]}`);
    res.writeHead(200, {'Content-Type': 'image/png' });
    res.end(img, 'binary');
  }
  else if(url[1] == "roll") {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    res.write(JSON.stringify({prize:Math.round(Math.random()*(Contents.length-1))}))
    res.end()
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});