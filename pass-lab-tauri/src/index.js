import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import { appWindow } from '@tauri-apps/api/window';

import Data from "./storage/Data"
import { AES } from "./helper/AES"
import { invoke } from '@tauri-apps/api';


appWindow.listen('tauri://close-requested', async (event,handler) =>{
  if (Data.data.data.length !== 0){
    let pass = prompt("Введи пароль: ")
    let dataEnc = await AES().encrypt(JSON.stringify(Data.data), pass)

    let res = await invoke("save_data", {data:dataEnc}) 

    switch (res) {
      case true:
        console.log(res)
        appWindow.close()
      break;
    
      default:
        alert("Что-то пошло не так...")
      break;
    }
  }
  else {
    appWindow.close()
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

