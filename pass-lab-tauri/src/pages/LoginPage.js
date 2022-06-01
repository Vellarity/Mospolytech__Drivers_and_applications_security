import React, { useState, useRef } from "react";
import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";

import { observer } from "mobx-react-lite";
import Data from "../storage/Data";

import { AES } from "../helper/AES";

export const LoginPage = observer(() =>{
    const [login, setLogin] = useState('')

    let navigate = useNavigate()

    const CheckLogin = async(loginString) =>{
        let res = await invoke("check_login", {loginString: loginString})
        switch (res) {
            case -1:
                window.alert("Пароль неверный!")
            break;
            case 2:
                window.alert("Это ваше первое посещение, записанный пароль будет использоваться далее.")
            break;
            case 1:
                let dataRes = await invoke("read_database")
                let decrypt = await AES().decrypt(dataRes, loginString)
                Data.writeData(decrypt)

                Data.writeOldData(decrypt)

                navigate("/mainList")

            break;
        }
    }

    return(
        <div className="h-screen flex flex-col justify-center items-center bg-neutral-600">
            <input onChange={(event) =>{setLogin(event.target.value)}} className="w-96 p-3 mb-9 text-2xl rounded-2xl" type="password"></input>
            <button onClick={()=>{CheckLogin(login)}} className="bg-purple-400 px-5 py-4 rounded-2xl font-semibold">Авторизоваться</button>
        </div>
    )
})