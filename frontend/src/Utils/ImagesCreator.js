const createImages = (contents, imgLoadFunction) =>{
    let contentsImages = []
    let loaded = []
    contents.forEach((content,i) =>{
      let contentImage = new Image()
      contentImage.src = `http://localhost:3001/image/${content.img}`
      contentImage.addEventListener("load", ()=>{imgLoadFunction(i)})
      contentsImages.push(contentImage)
      loaded.push(false)
    })
    return [contentsImages,loaded]
}

export default createImages;