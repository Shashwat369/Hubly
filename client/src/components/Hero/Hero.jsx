import React from 'react'
import play from '../../assets/play.png'
import Calender from '../../assets/Calender.png'
import comment from '../../assets/comment.png'
import graph from '../../assets/graph.png'
import heroMain from '../../assets/heroMain.png'
import './Hero.css'

const Hero = () => {
  return (
    <header className="hero">
    <div className="hero-content">
      <h1>Grow Your Business Faster with Hubly CRM</h1>
      <p>
        Manage deals, track performance, and close more sales with an all-powerful platform.
      </p>
      <div className="hero-buttons">
        <button className="btn btn-primary">Get Started ➜</button>
        <button className="btn btn-outline"><img src={play} alt="Play_Button" /> Watch Video</button>
      </div>
    </div>
    <div className="hero-image">
   <img src={heroMain} alt="Hero Main" />
   <img src={comment} alt="comment" />
   <img src={graph} alt="graph" />
   <img src={Calender} alt="calender" />

    </div>
  </header>
  )
}

export default Hero