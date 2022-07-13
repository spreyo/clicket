import React from "react";
import { useEffect, useState } from "react";

const VolumeSlider = () => {

  useEffect(()=>{
    document.getElementById('volume').value = 80.0;
  },[])
  return (
    <>
      <h1 id="volumeLabel">volume</h1>
      <input type="range" className="custom-range" min="0" max="100" step="5" id="volume"/>

    </>
  );
};
export default VolumeSlider;
