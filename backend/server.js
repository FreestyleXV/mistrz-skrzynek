const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3001;
const Contents = [{name:"MAJONEZ", color:"white", img:"majonez.png"}, {name:"KETCHUP", color:"red", img:"ketchup.png"}, {name:"MUSZTARDA", color:"yellow", img:"musztarda.png"}, {name:"SOS BARBEQUE", color:"brown", img:"sos_barbeque.png"}, {name:"CHRZAN", color:"white", img:"chrzan.png"}, {name:"PINK SAUCE", color:"pink", img:"pink_sauce.png"}, {name:"SOS 1000 WYSP", color:"salmon", img:"sos_1000_wysp.png"}]

const server = http.createServer((req, res) => {
  console.log(req.url)
  let url = req.url.split("/")
  if(url[1] == 'contents'){
    let rouletteLength = Math.round(Math.random()*2) + 50
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