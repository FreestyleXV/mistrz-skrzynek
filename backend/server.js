import { createServer } from 'http';
import { readFileSync } from 'fs';
import { Database } from './Utils/database.js';
import {MongoClient} from 'mongodb'
import drawPrize from './Utils/prizeDrawer.js';

const hostname = '127.0.0.1';
const port = 3001;

const uri = "mongodb+srv://FreestyleXV:qWlTconONbsCDNTR@cluster0.2qp8uxe.mongodb.net/?retryWrites=true&w=majority";
const db = new Database(uri)

const server = createServer(async (req, res) => {
  console.log(req.url)
  let url = req.url.split("/")
  if(url[1] == 'contents'){
    let content = await db.getCaseContentsFromUrl(url[2])
    if(content.error){
      if(content.error === "Empty Case"){
        res.writeHead(503, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'})
        res.write("Case does not have any content")
        res.end()
      }
      else{
        res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'})
        res.write("Such case does not exist. Bad url.")
        res.end()
      }
    }
    else{
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
      res.write(JSON.stringify(content.data))
      res.end()
    }
  }
  else if(url[1] == "roll") {
    const prizeFetch = await db.getPrize(url[2])
    if(prizeFetch.error){
      if(prizeFetch.error === "Nonexistent Case"){
        res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'})
        res.write("Such case does not exist. Bad url.")
        res.end()
      }
    }
    else{
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
      res.write(JSON.stringify({prize:prizeFetch.data}))
      res.end()
    }
    // client.connect(async err => {
    //   const cursor = client.db("mistrz-skrzynek").collection("cases_contents").find({
    //     case_id: ObjectId(url[2])
    //   }, {projection:{case_id:0, rarity:0, image:0}})
    //   const result = await cursor.toArray()

    //   if(result.length > 0){
    //     console.log("rolluje")
    //     const winnerNumber = Math.round(Math.random()*9999)+1
    //     let winnerCountDown = winnerNumber
    //     for(let i = 0; i < result.length; i++){
    //       if(result[i].win_chance >= winnerCountDown){
    //         console.log(result[i]._id.valueOf())
    //         res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    //         res.write(JSON.stringify({prize:result[i].name}))
    //         res.end()
    //         break
    //       }
    //       else{
    //         winnerCountDown -= result[i].win_chance
    //       }
    //     }
    //   }
    //   else{
    //     res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'})
    //     res.write("Bad url")
    //     res.end()
    //   }
    //   client.close()
    // })
  }
  else if(url[1] == "image") {
    var img = readFileSync(`./images/${url[2]}`);
    res.writeHead(200, {'Content-Type': 'image/png' });
    res.end(img, 'binary');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});