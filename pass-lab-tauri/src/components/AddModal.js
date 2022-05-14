import React, { useState } from "react";

import { AES } from "../helper/AES";

import Data from "../storage/Data";

export const AddModal = ({close}) => {
    const [url, setUrl] = useState("")
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    const CreateNewRec = async() =>{
        let masterPass = prompt("Введите пароль")

        let curl = url
        let clogin = await AES().encrypt(login, masterPass)
        let cpassword = await AES().encrypt(password, masterPass)

        Data.addData(curl, clogin, cpassword)

        close(false)
    }

    return (
        <div className="bg-purple-200 rounded-2xl w-[300px] h-[400px] flex flex-col justify-around pt-5 pb-1 px-8">
            <input onChange={(ev) =>{setUrl(ev.target.value)}} className="h-10 rounded-2xl px-2 py-1 outline-purple-100" placeholder="Ccылка"/>
            <input onChange={(ev) =>{setLogin(ev.target.value)}} className="h-10 rounded-2xl px-2 py-1 outline-purple-100" placeholder="Логин" type="password"/>
            <input onChange={(ev) =>{setPassword(ev.target.value)}} className="h-10 rounded-2xl px-2 py-1 outline-purple-100" placeholder="Пароль" type="password"/>
            <div className="flex justify-between">
                <button onClick={() =>{CreateNewRec()}} className="bg-purple-400 py-2 px-3 rounded-xl text-sm font-semibold">Добавить</button>
                <button onClick={() =>{close(false)}} className="bg-purple-400 py-2 px-3 rounded-xl text-sm font-semibold">Отмена</button>
            </div>
        </div>
    )
}