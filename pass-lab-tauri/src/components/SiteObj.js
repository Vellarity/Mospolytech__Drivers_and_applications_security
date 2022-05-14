import { invoke } from "@tauri-apps/api";
import React, {useRef} from "react";
import { AES } from "../helper/AES";
import Data from "../storage/Data";

export const SiteObj = ({url, login, password, id}) =>{

    const loginEl = useRef(null)
    const passwordEl = useRef(null)

    const CheckPass = async() =>{
        let password = prompt("Введите пароль:")
        console.log(password)

        let checkRes = await invoke("check_login", {loginString: password})
        switch (checkRes) {
            case -1:
                window.alert("Пароль неверный!")
            break;
            case 1:
                let trueLogin = await AES().decrypt(loginEl.current.value, password)
                let truePassword = await AES().decrypt(passwordEl.current.value, password)
                loginEl.current.value = trueLogin
                passwordEl.current.value = truePassword
                loginEl.current.type = "text"
                passwordEl.current.type = "text"

                password = undefined
            break;
        }
    }

    const deleteRec = (id) => {
        Data.deleteData(id)
    }


    return(
        <div className="min-w-max h-20 mx-1 px-3 flex justify-between items-center bg-purple-200 my-1 rounded-2xl">
            <div>
                <button onClick={() =>{deleteRec(id)}} className="bg-purple-400 px-3 py-3 rounded-2xl font-semibold mr-3">Удалить</button>
                <button onClick={() =>{CheckPass()}} className="bg-purple-400 px-3 py-3 rounded-2xl font-semibold">Показать</button>
            </div>
            <input className="bg-transparent w-32 h-8" value={url} disabled></input>
            <input ref={loginEl} className="bg-transparent w-24 h-8" value={login} type="password" disabled></input>
            <input ref={passwordEl} className="bg-transparent w-24 h-8" value={password} type="password" disabled></input>
        </div>
    )
}