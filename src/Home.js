import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { DivIcon } from 'leaflet';
import styled from 'styled-components';
import Navbarx from './navbar/Navbarx';
import { Modalx } from './gallery/Modalx';
import { EnhancedTable } from "./gallery/EnhancedTable";
import { Navigate, useLocation } from 'react-router-dom';
import { stylo } from '@papyrs/stylo/';
import logo from './config/logoi.png';
import openc from './config/openchat.png';


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

  useEffect(() => {
    // Function to create a single dot
    const createDot = () => {
      const dot = document.createElement('div');
      const size = Math.floor(Math.random() * 13) + 3;
      dot.style = `position: absolute; width: ${size}px; height: ${size}px; border-radius: 50%; background-color: #${Math.floor(Math.random() * 16777215).toString(16)}; left: ${Math.random() * 100}vw; top: ${Math.random() * (document.documentElement.scrollHeight)}px; transition: opacity 4s ease-in-out; opacity: 1; z-index: -1;`;
      return dot;
    };

    // Function to populate the container with dots
    const populateContainer = () => {
      const container = document.getElementById('dot-container');
      container.innerHTML = '';
      for (let i = 0; i < 100; i++) {
        const dot = createDot();
        container.appendChild(dot);

        // Individual timings for each dot's life cycle
        const lifeCycle = Math.random() * 20000;
        setTimeout(() => dot.style.opacity = 0, lifeCycle);
        setTimeout(() => {
          dot.remove();
          container.appendChild(createDot());
        }, lifeCycle + 4000);
      }
    };

    // Populate the container on component mount
    const container = document.createElement('div');
    container.id = 'dot-container';
    container.style = "position: absolute; width: 100%; height: 100%; z-index: -1;";
    document.body.appendChild(container);

    populateContainer();
  
  }, []);





  

  return (
    <>
      <Navbarx navitems={props.navitems} showModal={showModal} setShowModal={setShowModal} />
      <stylo />
      <Modalx notes="story" images="story" videos="story" defaultratio="" showModal={showModal} setShowModal={setShowModal} />
     
     {/* Main div adjusted */}
      <div style={{ position: 'absolute', top: 50, left: 0, width: '100%', height: 'auto', zIndex: 900 }}>

      <div id="dot-container"></div>


        {/* Logo image */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', zIndex: 900 }}>
          <img src={logo} alt="Logo" style={{ width: '30%', margin: '1%' }} />
        </div>

{/* OpenChat image */}
<div style={{ position: 'absolute', top: '0px', right: '50%', transform: 'translate(110%, 0%)' }}>
    <a href="https://oc.app/user/t4uah-qiaaa-aaaaf-atmgq-cai">  {/* Replace with your OpenChat URL */}
      <img src={openc} alt="OpenChat" style={{ width: '25%', cursor: 'pointer' }} /> {/* 10% because it's a third of the 30% logo width */}
    </a>
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



<div style={{ 
    width: '100%', 
    top: '100',  
    backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    padding: '2% 5%', // Increase padding for better readability
    zIndex: 1000 
  }}>
    <h1 style={{ 
      textAlign: 'center', 
      color: '#FFFFFF',  // Use hex code for better readability
      fontSize: '2.5em',  // Slightly increased size for emphasis
      marginBottom: '0em' // Added margin for better spacing
    }}> 
      THE PROJECT 
    </h1>

    <div style={{ 
  textAlign: 'center', 
  margin: '1em auto'  // Added margin for better spacing
}}>
  <span style={{ 
    display: 'inline-block',
    width: '10px', 
    height: '10px',
    backgroundColor: '#FFFFFF', 
    borderRadius: '50%', 
    margin: '0 5px'  // Space between the dots
  }}></span>
  <span style={{ 
    display: 'inline-block',
    width: '10px', 
    height: '10px',
    backgroundColor: '#FFFFFF', 
    borderRadius: '50%', 
    margin: '0 30px'  // Space between the dots
  }}></span>
  <span style={{ 
    display: 'inline-block',
    width: '10px', 
    height: '10px',
    backgroundColor: '#FFFFFF', 
    borderRadius: '50%', 
    margin: '0 5px'  // Space between the dots
  }}></span>
</div>

    {/* CONTENT */}
    <div style={{ 
      textAlign: 'left', 
      color: '#FFFFFF', 
      fontSize: '1.2em',  // Increased font size for better readability
      lineHeight: '1.6',  // Added line height for better readability
      marginBottom: '2em' // Added margin for better spacing
    }}>
      <h1 style={{ 
        textAlign: 'left', 
        color: '#FFFFFF', 
        fontSize: '2em',  // Increased size for emphasis
        marginBottom: '1em' // Added margin for better spacing
      }}> 
        Journey Beyond Tradition 
      </h1>
      Everyone has their own purpose in life. While many people find comfort and direction in the path set by their culture, family, or traditions, my experience has been a bit different. Introspection serves as a valuable tool for challenging these conventional paths, as it lends a rational approach to life decisions.

In my case, however, introspection wasn't the sole factor that led me to choose a different path, though it certainly played a role. I believe the environment and system around me constantly signaled that the 'normal' path was not sustainable. The realization set in that merely working hard in an office to support a civilization on the brink of collapse would only hasten that collapse—and I would be a part of it.

Inspired by the idea that we should be the change we wish to see in the world, I decided to align my actions with my beliefs, all while striving to live the best life I can envision. To me, life is about amassing as many diverse experiences as possible, interacting with a range of cultures, and embracing the full spectrum of human emotions. A desk job may have its rewards, but it offers a limited palette of experiences. After all, life's richness extends far beyond the colors displayed on a computer screen.
 
      <br />
      <h1 style={{ 
        textAlign: 'left', 
        color: '#FFFFFF', 
        fontSize: '2em',  // Increased size for emphasis
        marginBottom: '1em',  // Added margin for better spacing
        marginTop: '2em'  // Added margin for better spacing
      }}> 
        Passions in Tech and Travel 
      </h1>
      I have a background in Information Technology, and even though my career hasn't followed that path, my interest in the field remains unabated. Over the years, I've regularly updated my personal website, always staying attuned to the latest technological advancements. A few years ago, I was captivated by the idea of hosting my website on the blockchain to immortalize it. Discovering the Internet Computer prior to its genesis solidified my belief that it could revolutionize digital experiences while also addressing issues of democracy, transparency, sustainability, and decentralization.

In my younger years, I wasn't particularly keen on travel. However, certain individuals ignited my wanderlust, and over the last decade, I've lived in multiple countries, learned local languages, and accumulated invaluable experiences. Another facet of my life worth noting is my love for sports; I believe that mental well-being is inextricably linked to physical health, and a harmonious balance between the two is essential.

This philosophy has led me to develop a keen interest in bikepacking. So far, I've undertaken two trips, each covering around 3,000 km, through Portugal and Italy. These journeys were essentially trial runs to gauge my capabilities for much longer expeditions—like traversing Africa, the Silk Road, and North to South America.

I am optimistic that my goals are attainable through a combination of factors: my current savings, my frugal lifestyle, and the support of communities that I plan to advocate for during my travels. As I have no fixed commitments, my departure date is flexible, and the destination could even be influenced by you!

</div>


  {/* TOOLS CONTENT */}
  <div style={{ width: '100%', top: '100', padding: '1% 0' , zIndex: 1000 }}>
        <h1 style={{ textAlign: 'left', color: 'white', fontSize: '2.2em', }}>What am I bringing ?</h1>

  <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
    {/* You can replace `image1.jpg`, `image2.jpg`, etc. with your actual image URLs */}
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/velo-de-voyage-riverside-touring-900/_/R-p-332461?mc=8643287"}>
      <img src="https://m5rwi-daaaa-aaaal-acrpq-cai.icp0.io/story/bejiw-lmmap-dscrd-b6jed-6zrsu-nyrlm-wa4rn-e56p2-wqanx-doasx-zqe-riverside-touring-900.jpeg?token=FVLo9psSVwdSn2TKHoQwu" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/mp/brooks-england/selle-femme-b17-short/_/R-p-71dccd0a-06ab-43ef-ab3d-2ff7ac096873?mc=71dccd0a-06ab-43ef-ab3d-2ff7ac096873_c1"}>
      <img src="https://contents.mediadecathlon.com/m901211/k$7e155092efd33dc11bf37ea8362ae2cf/sq/selle-femme-b17-short.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/sacoche-velo-900-27l-impermeable/_/R-p-339156?mc=8738479&c=gris"}>
      <img src="https://contents.mediadecathlon.com/p2158385/k$4613eaf572c97c1fbdbe9290e21f7f24/sq/sacoche-velo-900-27l-impermeable-gris.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/sacoche-velo-900-27l-impermeable/_/R-p-339156?mc=8738479&c=gris"}>
      <img src="https://contents.mediadecathlon.com/p2158385/k$4613eaf572c97c1fbdbe9290e21f7f24/sq/sacoche-velo-900-27l-impermeable-gris.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/sacoche-velo-900-27l-impermeable/_/R-p-339156?mc=8738479&c=gris"}>
      <img src="https://contents.mediadecathlon.com/p2158385/k$4613eaf572c97c1fbdbe9290e21f7f24/sq/sacoche-velo-900-27l-impermeable-gris.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/sacoche-velo-900-27l-impermeable/_/R-p-339156?mc=8738479&c=gris"}>
      <img src="https://contents.mediadecathlon.com/p2158385/k$4613eaf572c97c1fbdbe9290e21f7f24/sq/sacoche-velo-900-27l-impermeable-gris.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/mp/hawkers/lunettes-de-soleil-pour-homme-et-femme-black-joker-polarized-one-raw/_/R-p-61192291-e979-4c5c-b2bf-55fd7bf4f3de?mc=61192291-e979-4c5c-b2bf-55fd7bf4f3de_c4.c9&c=blanc"}>
      <img src="https://contents.mediadecathlon.com/m12154743/k$858a459d0761a0ef798e1eff1123f860/sq/lunettes-de-soleil-pour-homme-et-femme-polarized-air-emerald-one-raw.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/serviette-microfibre-double-face-bleu-vert-ultra-compacte-taille-xl-110-x-175-cm/_/R-p-341936?mc=8751567"}>
      <img src="https://contents.mediadecathlon.com/p2248077/k$c2fc1dc2c1402db464a9e7c5f8758338/sq/serviette-microfibre-double-face-bleuvert-ultra-compacte-taille-xl-110-x-175-cm.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/sandales-de-randonnee-en-cuir-nh120-homme/_/R-p-324804?mc=8583436"}>
      <img src="https://contents.mediadecathlon.com/p2164538/k$a8b7c3cf3bfe6ffca95e91a9862f30e8/sq/sandales-de-randonnee-en-cuir-nh120-homme.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/mp/bresser/chargeur-de-porte-du-panneau-solaire-21w-bresser/_/R-p-f5d42fd4-8bea-45bc-91ca-69f726013872?mc=f5d42fd4-8bea-45bc-91ca-69f726013872_c1&c=noir"}>
      <img src="https://contents.mediadecathlon.com/m5348090/k$a9088daec2afb0bd50ef0ec1e680038e/sq/chargeur-de-porte-du-panneau-solaire-21w-bresser.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.cect-shop.com/en/hisense-a5c.html"}>
      <img src="https://i.ebayimg.com/images/g/HRgAAOSwOzxgc9O0/s-l1200.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/antivol-velo-u-920-art2-cable/_/R-p-168739?mc=8385299&c=jaune"}>
      <img src="https://contents.mediadecathlon.com/p2094309/k$b2b831d7d3c2382c99364c56da422a40/sq/antivol-velo-u-920-art2-cable.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.cdiscount.com/pret-a-porter/vetements/pantalon-viscose-thai-pour-femme-coline/f-1133022-mp77909528.html#mpos=0|mp"}>
      <img src="https://www.cdiscount.com/pdt2/5/2/8/1/550x550/mp77909528/rw/pantalon-viscose-thai-pour-femme-coline.jpg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://st2.depositphotos.com/1575949/7899/v/450/depositphotos_78999108-stock-illustration-under-construction-red-stamp-text.jpg"}>
      <img src="https://st2.depositphotos.com/1575949/7899/v/450/depositphotos_78999108-stock-illustration-under-construction-red-stamp-text.jpg" alt="Tool 2" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://www.decathlon.fr/p/bob-chasse-520-impermeable-et-resistant/_/R-p-329444?mc=8607186&c=marron"}>
      <img src="https://contents.mediadecathlon.com/p1999311/k$82c89e3d3e864edfe3a3bf983157aad2/sq/bob-chasse-520-impermeable-et-resistant-marron.jpg" alt="Tool 2" style={{ width: '100%', height: '100%' }} />
    </div>
    
    {/* Add more images similarly */}

    </div>
    </div>

        {/* Adding Supporter Section */}
        <div style={{ width: '100%', top: '100', padding: '1% 0' , zIndex: 1000 }}>
        <h1 style={{ textAlign: 'left', color: 'white', fontSize: '2.2em', }}>Supporters</h1>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
    {/* You can replace `image1.jpg`, `image2.jpg`, etc. with your actual image URLs */}
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer', backgroundColor: 'white' }} onClick={() => window.location.href="https://juno.build/"}>
      <img src="https://github.com/buildwithjuno/brand/raw/main/assets/juno_logo.svg" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://github.com/Kyliux/Icloud"}>
      <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Tool 1" style={{ width: '100%', height: '100%' }} />
    </div>
    <div style={{ width: '100px', height: '100px', margin: '5px', cursor: 'pointer' }} onClick={() => window.location.href="https://st2.depositphotos.com/1575949/7899/v/450/depositphotos_78999108-stock-illustration-under-construction-red-stamp-text.jpg"}>
      <img src="https://st2.depositphotos.com/1575949/7899/v/450/depositphotos_78999108-stock-illustration-under-construction-red-stamp-text.jpg" alt="Tool 2" style={{ width: '100%', height: '100%' }} />
    </div>
    {/* Add more images similarly */}

    </div>

          </div>
        


          </div>


        <div style={{ zIndex: 1000 }}>
      </div>
        <hr style={{ margin: '0 auto', width: '100%' , borderColor: 'white', opacity: 0.3 }} />
        <h1 style={{ textAlign: 'center', color: 'white', fontSize: '2.2em', }}>Q&A Section</h1>
        <hr style={{ margin: '0 auto', width: '100%', borderColor: 'white', opacity: 0.3 }} />
            {/* Adding Q&A Section */}
            <div style={{ width: '100%', top: '100', padding: '1% 5%' , zIndex: 1000 }}>
 

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
