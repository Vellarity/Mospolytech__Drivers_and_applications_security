import React from "react";

import Data from "../storage/Data";
import { AES } from "../helper/AES";
import { invoke } from "@tauri-apps/api";
import { observer } from "mobx-react-lite";

export const ConfirmModal = observer(({close}) =>{

    const SaveChanges = async() =>{
        if (Data.data.data.length !== Data.oldData.data.length){

            let password = prompt("Введите пароль:");

            let checkPassword = await invoke("check_login", {loginString: password});

            switch (checkPassword) {
                case -1:
                    window.alert("Пароль неверный!")
                break;
                case 1:
                    let dateObject = new Date()

                    let fileName = `${dateObject.getDate()}.${dateObject.getMonth()}.${dateObject.getFullYear()}_(${dateObject.getHours()}-${dateObject.getMinutes()}-${dateObject.getSeconds()}).json`

                    let newDataEnc = await AES().encrypt(JSON.stringify(Data.data), password)
                    let newRes = await invoke("save_data", {data:newDataEnc}) 
                    
                    let oldDataEnc = await AES().encrypt(JSON.stringify(Data.oldData), password)
                    let oldRes = await invoke("save_copy", {data:oldDataEnc, fileName:fileName})

                    if (newRes === true && oldRes === true){
                        alert("Успешно!")
                        Data.swapData()
                    } 
                    else {
                        alert("Произошла непредвиденная ошибка, попробуйте ещё раз.")
                    }
                break;
            }
        }
    }

    return(
        <div className="bg-purple-200 rounded-2xl w-[500px] h-[200px] flex flex-col justify-around pt-5 pb-1 px-6">
            <div className="self-center text-base">Вы уверены, что хотите сохранить текщие изменения?</div>

            <div className="flex justify-end">
                <button onClick={() => {SaveChanges()}} className="mr-4 bg-purple-400 py-2 px-3 rounded-xl text-base font-semibold">Да</button>
                <button onClick={() => close(false)} className="mr-4 bg-purple-400 py-2 px-3 rounded-xl text-base font-semibold">Нет</button>
            </div>
        </div>
    )
})