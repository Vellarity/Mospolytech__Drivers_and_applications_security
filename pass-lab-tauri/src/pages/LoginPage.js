import React, { useState, useRef } from "react";
import { invoke } from "@tauri-apps/api";
import { Link, useNavigate } from "react-router-dom";

import { observer } from "mobx-react-lite";
import Data from "../storage/Data";

import { AES } from "../helper/AES";

import {ReactComponent as EYE} from "../resources/eye.svg";

export const LoginPage = observer(() =>{
    const [login, setLogin] = useState('')

    const faceRecLink = useRef(null)

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

                /* let tempData = JSON.parse(decrypt)

                for (let i=0; i<tempData.data.length; i++){
                   tempData.data[i].login = await AES().encrypt(tempData.data[i].login+i, loginString)
                   tempData.data[i].password = await AES().encrypt(tempData.data[i].password+i, loginString)
                }

                let devEnc = await AES().encrypt(JSON.stringify(tempData), loginString)

                await invoke("dev_write_data", {data:devEnc}) */

               /* navigate("/mainList") */

                faceRecLink.current.classList.remove("pointer-events-none")
                faceRecLink.current.classList.remove("bg-red-400")
                faceRecLink.current.classList.add("bg-green-400")
            break;
        }
    }

    return(
        <div className="h-screen flex flex-col justify-center items-center bg-neutral-600">
            <input onChange={(event) =>{setLogin(event.target.value)}} className="w-96 p-3 mb-9 text-2xl rounded-2xl" type="password"></input>
            <button onClick={()=>{CheckLogin(login)}} className="bg-purple-400 px-5 py-4 rounded-2xl font-semibold">Авторизоваться</button>

            <Link ref={faceRecLink} className="no-underline bg-red-400 px-2 py-1 rounded-2xl font-semibold fixed bottom-1 right-1 pointer-events-none" to="/faceLog">
                <EYE width={"30px"}/>
            </Link>
        </div>
    )
})