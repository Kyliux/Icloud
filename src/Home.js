import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { DivIcon } from 'leaflet';
import styled from 'styled-components';
import Navbarx from './navbar/Navbarx';
import { Modalx } from './gallery/Modalx';
import { EnhancedTable } from "./gallery/EnhancedTable";
import { useLocation } from 'react-router-dom';
import { stylo } from '@papyrs/stylo/';
import logo from './config/logoi.png';


//data type button to give Navbarx
// button name + onclickfct

//HOME SECTION
// WELCOME
// 
// CONTACT + github
// 






const Home = (props) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const poemStyle = {
    textAlign: 'center',
    marginTop: '1%',  // Reduced from 5% to 1%
    marginBottom: '1%', // Reduced from 5% to 1%
    fontSize: '2em',
    fontWeight: 'bold',
    color: 'white',
  };


  const toggleAnswer = (id) => {
    const answerDiv = document.getElementById(id);
    if (answerDiv.style.display === "none" || answerDiv.style.display === "") {
      answerDiv.style.display = "block";
    } else {
      answerDiv.style.display = "none";
    }
  };

  const questionStyle = {
    textAlign: 'left',
    color: '#FFFFFF',  // white
    fontSize: '1.5em',  // bigger font
    cursor: 'pointer',
    marginBottom: '1em'  // space below each question
  };
  
  const answerStyle = {
    textAlign: 'left',
    color: '#FFFFFF',  // white
    fontSize: '1.5em',  // smaller than the question
    display: 'none',  // initially hidden
    paddingLeft: '1em',  // indented
    lineHeight: '1.4',  // space between lines of text
    marginBottom: '1em'  // space below each answer
  };


  return (
    <>
      <Navbarx navitems={props.navitems} showModal={showModal} setShowModal={setShowModal} />
      <stylo />
      <Modalx notes="story" images="story" videos="story" defaultratio="" showModal={showModal} setShowModal={setShowModal} />
     
     {/* Main div adjusted */}
      <div style={{ position: 'absolute', top: 50, left: 0, width: '100%', height: 'auto', zIndex: 900 }}>



        {/* Logo image */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', zIndex: 900 }}>
          <img src={logo} alt="Logo" style={{ width: '30%', margin: '1%' }} />
        </div>


        {/* First part of the poem */}
        <div style={poemStyle}>
          On two wheels, the world unfolds, <br />
          Rich with tales that must be told. <br />
        </div>

        <hr style={{ margin: '0 auto', width: '10%', borderColor: 'white', opacity: 0.3 }} />

         {/* Second part of the poem */}
         <div style={poemStyle}>
          This lengthy journey I undertake, <br />
          To meet kind souls, for shared dreams' sake.
        </div>
      
        <div style={{ padding: '5% 0' , zIndex: 1000 }}>
      </div>
        <hr style={{ margin: '0 auto', width: '100%' , borderColor: 'white', opacity: 0.3 }} />

            {/* Adding Q&A Section */}
            <div style={{ width: '100%', top: '100',  backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: '1% 0' , zIndex: 1000 }}>
        <h1 style={{ textAlign: 'center', color: 'white', fontSize: '2.2em', }}>Q&A Section</h1>
        <hr style={{ margin: '0 auto', width: '100%', borderColor: 'white', opacity: 0.3 }} />

        <div onClick={() => toggleAnswer("answer0")} style={questionStyle}>
          Is this website ... ? <span>▼</span>
        </div>
        <div id="answer0" style={answerStyle}>
       
        It is not finished and has still bugs and improvement scheduled. But I still hope you like it !
        <br/> Hosted using <a href="https://juno.build/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Juno</a> and love on the IC.
        <br/> Here find the source code  <a href="https://github.com/Kyliux/Icloud" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Github</a>.




        </div>


        {/* Question 1 */}
        <div onClick={() => toggleAnswer("answer1")} style={questionStyle}>
          Why are you doing this ? <span>▼</span>
        </div>
        <div id="answer1" style={answerStyle}>
        I've always found cycling around the globe to be incredibly rewarding
        <br />  - First and foremost, the bicycle allows me to experience landscapes at an ideal pace. Everything moves just fast enough to keep my senses engaged, yet slow enough to allow me the time to absorb the beauty that surrounds me.
          <br />  - Bikes are like magnets for awesome conversations. No kidding, I've had chats that were both profound and profoundly funny, often with people I've just met! Who knows, we might even meet !
          <br /> - From unpredictable weather to mysterious bike paths that Google Maps never heard of, every day has its mini-adventures that keep your brain in high gear.
          <br /> - Besides testing my endurance and my laundry skills, I aim to share these journeys with you. Let's create stories, meet incredible humans, and discover ideas and values that could very well be life-changing
        </div>

        {/* Question 2 */}
        <div onClick={() => toggleAnswer("answer2")} style={questionStyle}>
          How long are you doing this ? <span>▼</span>
        </div>
        <div id="answer2" style={answerStyle}>
        Well, you see, time's not exactly the issue, as long as the cash keeps rolling in, so do I. 
        <br /> Want to sponsor my next leg? Your logo/app/website might be the main topic in my next story. And hey, if you have a cool project on the #internetcomputer, my route might just get a detour. 
        <br />You can even influence my path, but let's keep it above board, people; I won't be cycling through 'No Entry' signs or promoting anything sketchy. </div>
        <div onClick={() => toggleAnswer("answer3")} style={questionStyle}>
          What are the values/things you are promoting ? <span>▼</span>
        </div>
        <div id="answer3" style={answerStyle}>
        First off, world peace—yeah, it's a cliché, but only because it's important, folks. It's like the Wi-Fi of humanity; everyone needs it, but they forget until it's gone.        Respect and open mind : necessary values to reach the above.
        <br /> Then, let's talk respect and open-mindedness. Think of them as the two wheels of a bike: without one, you're going in circles. Get it?
        <br /> A sustainable future is a must! We're talking less Game of Thrones, more Captain Planet. So less sword fights and more saving trees and, oh yeah, blockchain that actually does something useful for once.
        <br /> And lastly, enjoying the journey! On a bike, the world's your oyster, but with less seafood. Slow travel, baby, where the adventures are as rich as a triple-fudge sundae. 
       </div>

       <div onClick={() => toggleAnswer("answer4")} style={questionStyle}>
          When are you starting ? <span>▼</span>
        </div>
        <div id="answer4" style={answerStyle}>
       
        August 2024 if everything goes as panned.

        </div>

        <div onClick={() => toggleAnswer("answer5")} style={questionStyle}>
          How to contact you ? <span>▼</span>
        </div>
        <div id="answer5" style={answerStyle}>
  So far you can contact me on  <a href="https://x.com/ICbicycle" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>@ICbicycle</a>.
</div>





        </div>

      </div>

 
    </>
  );
};

export default Home;
