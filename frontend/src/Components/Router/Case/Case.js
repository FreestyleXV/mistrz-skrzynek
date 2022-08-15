import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {Fetcher, fetchPrize} from '../../../Utils/DataFetch'
import createImages from '../../../Utils/ImagesCreator'
import './Case.css'
import caseIndividualBackgroundImage from '../../../Images/case_individual_background.png'
import CaseIndividual from '../../CaseIndividual/CaseIndividual'


function Case(props) {

  const [caseContentsStatus, setCaseContentsStatus] = useState("fetching")
  const [caseContents, setCaseContents] = useState([])
  const [caseContentsImages, setCaseContentsImages] = useState([])
  const [caseContentsImagesLoaded, setCaseContentsImagesLoaded] = useState([])
  const [randomContents, setRandomContents] = useState([])
  const [rouletteLength, setRouletteLength] = useState(0)


  // const [prize, setPrize] = useState(null)

  const prize = useRef(null)
  const [play, setPlay] = useState(false)

  const canvasRef = useRef(null)

  const randomDuration = useRef(Math.round(Math.random()*190)+105)
  const currentRandomDuration = useRef(randomDuration.current)
  const rouletteMove = useRef(0)
  const skipped = useRef(0)
  const speed = useRef(0)
  const slowRatio = useRef(0)
  const rollStartTime = useRef(0)
  const currentDuration = useRef(0)

  const rouletteIndividualLength = useRef(200)

  let {id} = useParams()
  
  useEffect(() => {
    Fetcher(id).then((res)=>{
      if(res.error){
        setCaseContentsStatus("error");
      }
      else{
        setCaseContents(res.data.contents)
        setRandomContents(res.data.roulette)
        setRouletteLength(res.data.length)
        speed.current = ((res.data.length-10)*rouletteIndividualLength.current)/5
        slowRatio.current = speed.current/10
        setCaseContentsStatus("fetched")
        const ImagesData = createImages(res.data.contents,imgLoaded);
        setCaseContentsImages(ImagesData[0]);
        setCaseContentsImagesLoaded(ImagesData[1]);
      }
    })
  }, [id])

  const imgLoaded = (id) => {
    setCaseContentsImagesLoaded(prev => {
      prev[id] = true
      return prev
    })
  }

  const draw = (ctx, lfrt, cfrt) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let move = rouletteMove.current
    if(play && skipped.current < rouletteLength-8){
      let moveLength = 10 - (skipped.current/(rouletteLength-8))*10
      move += moveLength<0.75?0.75:moveLength
    }
    else if(play && currentRandomDuration.current>0){
      move += 0.5
      currentRandomDuration.current -= 0.5
    }
    
    randomContents.forEach((id, i) => {
      let currentContent = caseContents[id]
      if(i === rouletteLength-5 && prize.current!=null){
        currentContent = caseContents[prize]
      }
      const contentsGradient = ctx.createLinearGradient(0, 100, 200, 100);
      contentsGradient.addColorStop(0, "rgba(0,0,0)");
      
      
      switch(currentContent.rarity){
        case "L":
          ctx.fillStyle = "#c7a946"
          // contentsGradient.addColorStop(1, "#c7a946");
          break;
        case "X":
          ctx.fillStyle = "#8e3232"
          // contentsGradient.addColorStop(1, "#8e3232");
          break;
        case "E":
          ctx.fillStyle = "#643c61"
          // contentsGradient.addColorStop(1, "#643c61");
          break;
        case "R":
          ctx.fillStyle = "#396088"
          // contentsGradient.addColorStop(1, "#396088");
          break;
        case "U":
          ctx.fillStyle = "#39795a"
          // contentsGradient.addColorStop(1, "#39795a");
          break;
        case "C":
          ctx.fillStyle = "#636664"
          // contentsGradient.addColorStop(1, "#636664");
          break;
      }
      // ctx.fillStyle = contentsGradient
      ctx.fillRect(-(rouletteIndividualLength.current/2)+(rouletteIndividualLength.current*i)-move, 0, rouletteIndividualLength.current, 200)
      // ctx.fillStyle = "black"
      // ctx.fillRect(-(rouletteIndividualLength.current/2)+(rouletteIndividualLength.current*i)-move+10, 10, rouletteIndividualLength.current-20, 180)
      if(caseContentsImagesLoaded[id]){
        ctx.drawImage(caseContentsImages[id], -100+(rouletteIndividualLength.current*i)-move+10, 10, 180, 180)
      }
    });
    const blackoutGradient = ctx.createLinearGradient(0, 100, 800, 100);

    // Add three color stops
    blackoutGradient.addColorStop(0, "rgba(0,0,0,1)");
    blackoutGradient.addColorStop(0.1, "rgba(0,0,0,0)");
    blackoutGradient.addColorStop(0.9, "rgba(0,0,0,0)");
    blackoutGradient.addColorStop(1, "rgba(0,0,0,1)");

    // Set the fill style and draw a rectangle
    ctx.fillStyle = blackoutGradient;
    ctx.fillRect(0, 0, 800, 200);
    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.moveTo(380, 0)
    ctx.lineTo(399, 30)
    ctx.lineTo(401, 30)
    ctx.lineTo(420, 0)
    ctx.fill()
    ctx.moveTo(380, 200)
    ctx.lineTo(399, 170)
    ctx.lineTo(401, 170)
    ctx.lineTo(420, 200)
    ctx.fill()
    ctx.closePath()
    ctx.fillRect(398, 0, 4, 200)
    skipped.current = Math.floor(move/rouletteIndividualLength.current)
    rouletteMove.current = move
  }

  useEffect(() => {
    if(caseContentsStatus==="fetched"){
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      let animationFrameId
      let lastFrameRenderTime = Date.now()
      rollStartTime.current = Date.now()

    
    //Our draw came here
      const render = () => {
        let currentFrameRenderTime = Date.now()
        draw(context, lastFrameRenderTime, currentFrameRenderTime)
        lastFrameRenderTime = currentFrameRenderTime
        animationFrameId = window.requestAnimationFrame(render)
        }
        render()
    
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [draw, caseContentsStatus])

  const click = async () => {
    fetchPrize(id).then(res=>{
      if(res.error){
        console.log("dupa")
      }
      else{
        console.log(res.prize)
        prize.current = res.prize
        setPlay(prev => !prev)
      }
    })
    // console.log(caseContents)
    // console.log(caseContentsStatus)
    // console.log(rouletteLength)
    // console.log(rouletteMove)
    console.log((rouletteLength-8)*200+randomDuration.current)
  }
  

  const renderContents = () =>{

  }

  return (
    <div>
        <div className='navbar'>
            <p onClick={click}>DUPA</p>
            <p>DUPA</p>
            <p>DUPA</p>
            <p>DUPA</p>
            <p>DUPA</p>
            <p>DUPA</p>
            <p>DUPA</p>
        </div>
        <div className='app'>
          <div className='roulette-box'>
            {caseContentsStatus==="fetched"?<div>
              <canvas ref={canvasRef} width="800" height="200"></canvas>
            </div>:<div>nieok</div>}
          </div>
          {caseContentsStatus==="fetched"?<div className='case-contents'>
            {caseContents.map((el, i) => 
              // <div className='case-contents-individual' style={{"borderColor": el.color}} key={i}>
              //   {/* <div style={{"backgroundColor": el.color}}>{el.name}</div> */}
              //   <div className='case-contents-individual-img-container' style={{"backgroundColor": 'red'}}>
              //     <img src={caseIndividualBackgroundImage} alt="background"></img>
              //     <img id={`img${el.name}`} src={`http://localhost:3001/image/${el.img}`} alt={el.name} ></img>
              //   </div>
              // </div>
              <CaseIndividual key={i} {...el}></CaseIndividual>
            )}
          </div>:<div>nieok</div>}
        </div>
    </div>
  )
}

export default Case