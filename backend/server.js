import { createServer } from 'http';
import { readFileSync } from 'fs';
import { Database } from './Utils/database.js';
import {MongoClient} from 'mongodb'
import drawPrize from './Utils/prizeDrawer.js';

const hostname = '127.0.0.1';
const port = 3001;

const uri = "dupa";
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