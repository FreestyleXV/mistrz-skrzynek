import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {Fetcher, fetchPrize} from '../../../Utils/DataFetch'
import createImages from '../../../Utils/ImagesCreator'
import './Case.css'
import CaseIndividual from '../../CaseIndividual/CaseIndividual'


function Case(props) {

  const [caseContentsStatus, setCaseContentsStatus] = useState("fetching")
  const [caseContents, setCaseContents] = useState([])
  const [caseContentsImages, setCaseContentsImages] = useState([])
  const [caseContentsImagesLoaded, setCaseContentsImagesLoaded] = useState([])
  const [randomContents, setRandomContents] = useState([])
  const [rouletteLength, setRouletteLength] = useState(0)

  const prize = useRef(null)
  const [play, setPlay] = useState(false)
  const [finished, setFinished] = useState(false)

  const canvasRef = useRef(null)

  const randomDuration = useRef(Math.round(Math.random()*190)+105)
  const currentRandomDuration = useRef(randomDuration.current)
  const rouletteMove = useRef(0)
  const skipped = useRef(0)
  const speed = useRef(0)
  const slowRatio = useRef(0)
  const rollStartTime = useRef(0)

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
    else if(currentRandomDuration.current===0){
      setFinished(true)
      setPlay(false)
    }
    else{
      setPlay(false)
    }
    
    randomContents.forEach((id, i) => {
      let currentContent = caseContents[id]
      if(i === rouletteLength-5 && prize.current != null){
        currentContent = caseContents[prize.current];
      }
      const x_pos = -(rouletteIndividualLength.current/2)+(rouletteIndividualLength.current*i)-move;
      const radialGradient = ctx.createRadialGradient(
        x_pos + rouletteIndividualLength.current /2,
        100,
        rouletteIndividualLength.current/3.5,
        x_pos + rouletteIndividualLength.current /2,
        100,
        rouletteIndividualLength.current/1.2);
      let color = "#000000"
      switch(currentContent.rarity){
        case 6:
          color = "#c7a946"
          break;
        case 5:
          color = "#8e3232"
          break;
        case 4:
          color = "#643c61"
          break;
        case 3:
          color = "#396088"
          break;
        case 2:
          color = "#39795a"
          break;
        case 1:
          color = "#636664"
          break;
      }
      radialGradient.addColorStop(0,'black');
      radialGradient.addColorStop(1,color)
      ctx.fillStyle = radialGradient;
      ctx.fillRect(x_pos, 0, rouletteIndividualLength.current, 200);
      if(i === rouletteLength-5 && prize.current != null){
        if(caseContentsImagesLoaded[prize.current]){
          ctx.drawImage(caseContentsImages[prize.current], -100+(rouletteIndividualLength.current*i)-move, 0, 200, 200)
        }
      }
      else{
        if(caseContentsImagesLoaded[id]){
          ctx.drawImage(caseContentsImages[id], -100+(rouletteIndividualLength.current*i)-move, 0, 200, 200)
        }
      }
    });
    const blackoutGradient = ctx.createLinearGradient(0, 100, 800, 100);

    blackoutGradient.addColorStop(0, "rgba(0,0,0,1)");
    blackoutGradient.addColorStop(0.1, "rgba(0,0,0,0)");
    blackoutGradient.addColorStop(0.9, "rgba(0,0,0,0)");
    blackoutGradient.addColorStop(1, "rgba(0,0,0,1)");

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

  const startRoulette = async () => {
    if(!play){
      fetchPrize(id).then(res=>{
        if(res.error){
        }
        else{
          console.log(res.prize)
          prize.current = caseContents.findIndex(contents => contents.id == res.prize)
          setPlay(true)
        }
      })
    }
  }

  const resetRoulette = () => {
    if(finished){
      randomDuration.current = Math.round(Math.random()*190)+105
      currentRandomDuration.current = randomDuration.current
      rouletteMove.current = 0
      skipped.current = 0
      speed.current = 0
      slowRatio.current = 0
      rollStartTime.current = 0
      setPlay(false)
      setFinished(false)
    }
  }

  return (
    <div>
        <div className='navbar'>
            <p onClick={startRoulette}>DUPCIA</p>
            <p>DUPA</p>
            <p>DUPA</p>
            <p>DUPA</p>
            <p>DUPA</p>
            <p>DUPA</p>
            <p>DUPA</p>
        </div>
        <div className='app'>
          <div className='roulette-box'>
            {caseContentsStatus==="fetched"?<div className='canvas-div'>
              <canvas ref={canvasRef} width="800" height="200"></canvas>
            </div>:<div>nieok</div>}
            <div className="roulette-buttons-container">
              {play===false?
                finished===false?
                  <div className="roulette-start-button" onClick={startRoulette}><p>START</p></div>:
                  <div className="roulette-reset-button" onClick={resetRoulette}><p>RESET</p></div>:
                <div><p>CZEKAJ...</p></div>} 
            </div>
          </div>
          {caseContentsStatus==="fetched"?<div className='case-contents'>
            {caseContents.map((el, i) => 
              <CaseIndividual key={i} {...el}></CaseIndividual>
            )}
          </div>:<div>nieok</div>}
        </div>
    </div>
  )
}

export default Case