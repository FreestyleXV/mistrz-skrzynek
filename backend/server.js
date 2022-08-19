const http = require('http');
const fs = require('fs');
const mysql = require('mysql');

const hostname = '127.0.0.1';
const port = 3001;
const Contents = [{name:"MAJONEZ", rarity:"L", img:"majonez.png"}, {name:"KETCHUP", rarity:"R", img:"ketchup.png"}, {name:"MUSZTARDA", rarity:"C", img:"musztarda.png"}, {name:"SOS BARBEQUE", rarity:"X", img:"sos_barbeque.png"}, {name:"CHRZAN", rarity:"C", img:"chrzan.png"}, {name:"SOS 1000 WYSP", rarity:"E", img:"sos_1000_wysp.png"}]


function initializeConnection(config) {
  function addDisconnectHandler(connection) {
      connection.on("error", function (error) {
          if (error instanceof Error) {
              if (error.code === "PROTOCOL_CONNECTION_LOST") {
                  console.error(error.stack);
                  console.log("Lost connection. Reconnecting...");

                  initializeConnection(connection.config);
              } else if (error.fatal) {
                  throw error;
              }
          }
      });
  }

  var connection = mysql.createConnection(config);

  // Add handlers.
  addDisconnectHandler(connection);

  connection.connect();
  return connection;
}


const dbConnection = initializeConnection({
  host:"localhost",
  user:"root",
  password:"",
  database: "mistrz-skrzynek"
})

const server = http.createServer(async (req, res) => {
  console.log(req.url)
  let url = req.url.split("/")
  if(url[1] == 'contents'){
    let caseId = parseInt(url[2])
    console.log(caseId, "siemano")
    if(isNaN(caseId)){
      res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'})
      res.write("Bad url")
      res.end()
    }
    else{
      dbConnection.query({
        sql: "SELECT * FROM cases_contents WHERE `case_id`= ?",
        values: [caseId]
      }, function (err, result, fields) {
        if (err){
          res.writeHead(503, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'})
          res.write("Could not get data")
          res.end()
        }
        else{
          let rouletteLength = Math.round(Math.random()*2) + 30
          let rouletteContents = []
          for(let i = 0; i < rouletteLength; i++){
            rouletteContents.push(Math.round(Math.random()*(Contents.length-1)))
          }
          console.log('pobrano dane')
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
          res.write(JSON.stringify({contents:result, length:rouletteLength, roulette:rouletteContents}))
          res.end()
        }
      });
    }
  }
  else if(url[1] == "roll") {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    res.write(JSON.stringify({prize:Math.round(Math.random()*(Contents.length-1))}))
    res.end()
  }
  else if(url[1] == "image") {
    var img = fs.readFileSync(`./images/${url[2]}`);
    res.writeHead(200, {'Content-Type': 'image/png' });
    res.end(img, 'binary');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});