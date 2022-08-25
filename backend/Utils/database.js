import {MongoClient, ObjectId} from 'mongodb'
import drawPrize from './prizeDrawer.js';

class Database{

    uri = ""
    client = undefined

    constructor(uri){
      console.log(uri)
      this.uri = uri
      this.client = new MongoClient(uri);
    }

    async getCaseContentsFromUrl(caseUrl){
      console.log(caseUrl)
      return new Promise(async(resolve, reject) => {
        this.client.connect(async err => {
          console.log("dupsko")
          const isCase = await this.client.db("mistrz-skrzynek").collection("cases").findOne({
              url: caseUrl
          })
          if(isCase){
            const cursor = this.client.db("mistrz-skrzynek").collection("cases_contents").find({
              case_id: isCase._id
            }, {projection:{case_id:0}})
            const result = await cursor.toArray()
            this.client.close();
            if(result.length > 0){
              resolve({error:false, data:{contents:result, case_id:isCase._id}})
            }
            else{
              resolve({error:"Empty Case", data:undefined})
            }
          }
          else{
              this.client.close();
              resolve({error:"Bad Uri", data:undefined})
          }
        });
      })
    }

    async getPrize(caseId, user = undefined){
      return new Promise((resolve, reject)=>{
        this.client.connect(async err => {
          const cursor = this.client.db("mistrz-skrzynek").collection("cases_contents").find(
            {case_id: ObjectId(caseId)},
            {projection:{case_id:0}}
          )
          const result = await cursor.toArray()
          this.client.close();
          if(result.length > 0){
            const prize = drawPrize(result)
            resolve({error:false, data:prize})
          }
          else{
          resolve({error:"Nonexistent Case", data:undefined})
          }
        });
      })
    }
}

export {Database}