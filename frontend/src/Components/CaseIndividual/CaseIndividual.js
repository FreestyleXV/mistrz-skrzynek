import React from 'react'
import './CaseIndividual.css'
import LegendaryBg from '../../Images/case-individual-background-legendary.png'
import ExtremeBg from '../../Images/case-individual-background-extreme.png'
import EpicBg from '../../Images/case-individual-background-epic.png'
import RareBg from '../../Images/case-individual-background-rare.png'
import UncommonBg from '../../Images/case-individual-background-uncommon.png'
import CommonBg from '../../Images/case-individual-background-common.png'

function CaseIndividual(props) {

  let bg = CommonBg
  switch(props.rarity){
    case "L":
      bg = LegendaryBg
      break;
    case "X":
      bg = ExtremeBg
      break;
    case "E":
      bg = EpicBg
      break;
    case "R":
      bg = RareBg
      break;
    case "U":
      bg = UncommonBg
      break;
  }

  return (
    <div className='case-contents-individual' style={{'backgroundImage': `url(${bg})`}}>
      <img className='case-contents-individual-img' src={`http://localhost:3001/image/${props.img}`} alt={props.name} draggable='false'></img>
    </div>
  )
}

export default CaseIndividual