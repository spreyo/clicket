import React from "react";
import { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown";
import VolumeSlider from "./components/VolumeSlider";

const App = () => {
  const [volumeV, setVolumeV] = useState();


  useEffect(() => {
    api.send('getFromStore', 'volume');
    api.recieve('gotVolume', (e,message)=>{
      volume.value = e;
      setVolumeV(e)
    })

    api.send('getFromStore', 'select');
      api.recieve('gotSelect', (e, message)=>{
        document.getElementById("clickSounds").value = e;
      })



    const volume = document.getElementById("volume");
    setVolumeV(volume.value);
    volume.oninput = () => {
      setVolumeV(volume.value);
      const volumeValue = document.getElementById("volumeValue");
      api.send('saveToStore', ['volume', volume.value])
    };
    handleClickSounds();
  }, []);

  function handleClickSounds(){
    api.recieve('mouseclick', ()=>{
      var source = `./sounds/${document.getElementById("clickSounds").value}/click.mp3`
      var clickSound = new Audio(source);
      var volumeToset = document.getElementById('volume').value / 100
      clickSound.volume = volumeToset;
      clickSound.play();

      api.send('saveToStore', ['select', document.getElementById('clickSounds').value]);
      
      
  })
  }
  
  function exitApp() {
    api.send("exit", "true");
  }
  
  function hideApp() {

    api.send("hide", "true");
  }

  return (
    <div className="content">
      <div className="topBar">
        <div className="titleBar">
          <h1>clicket</h1>
        </div>
        <div id="close" onClick={() => exitApp()}></div>
        <div id="hide" onClick={() => hideApp()}></div>
      </div>
      <h1 className="title is-1" id="mainTitle">
        clicket
      </h1>
      <Dropdown />
      <VolumeSlider />
      <h1 id="volumeValue">{volumeV}</h1>
      <p id="footer">Made by <a onClick={()=>{api.send('openExternal', "http://github.com/spreyo")}} href="">spreyo</a></p>
    </div>
  );
};

export default App;
