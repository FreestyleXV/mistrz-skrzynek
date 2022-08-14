
/**
* Fetching From id or something
* Returns Object 
* {
*   Error: boolean  
* }
*/
const Fetcher = (id) => {
    return new Promise(async (resolve) =>{
        await fetch(`http://localhost:3001/contents/${id}`)
        .then(res=>res.json()
            .then(data=>{
            resolve({
                Errror:false,
                data:data
            })
        }))
        resolve({
            Error:true,
            data:null
        })
        })
}


const fetchPrize = (id) => {
    return new Promise(async (resolve) =>{
        await fetch(`http://localhost:3001/roll/${id}`)
        .then(res=>res.json()
            .then(data=>{
            resolve({
                Errror:false,
                prize:data.prize
            })
        }))
        resolve({
            Error:true,
            prize:null
        })
        })
}

export {Fetcher}
export {fetchPrize}