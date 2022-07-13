import React from "react";
import { useEffect, useState } from "react";

const Dropdown = () => {
  useEffect(() => {
    api.send('getFiles');
      api.recieve('gotFiles', (e,message)=>{
        const select = document.getElementById('clickSounds');
        e.forEach((val)=>{
          var option = document.createElement("option")
          option.setAttribute("value", val);
          option.innerHTML = val;
          select.appendChild(option);
        })
    })
  }, []);


  return (
    <>
      <select name="clickSounds" id="clickSounds">
      </select>
    </>
  );
};

export default Dropdown;
