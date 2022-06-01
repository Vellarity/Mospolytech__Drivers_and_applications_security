import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SiteObj } from "../components/SiteObj";
import { AddModal } from "../components/AddModal";

import Data from "../storage/Data";
import { observer } from "mobx-react-lite";

import "./ScrollBar.css"
import { AES } from "../helper/AES";
import { invoke } from "@tauri-apps/api";
import { toJS } from "mobx";
import { ConfirmModal } from "../components/ConfirmModal";

window.confirm = async function() {
    return Promise.resolve(true);
}

export const MainPage = observer(() =>{
    const [visible, setVisible] = useState(false)
    const [saveVisible, setSaveVisible] = useState(false)

    const SearchRecs = (searchString) => {
        Data.findData(searchString)
    }

    const MakeCopy = async() => {
        let password = prompt("Введите пароль:")

        let checkPassword = await invoke("check_login", {loginString: password})

        let printData = Data.searchData == undefined ? toJS(Data.data.data) : toJS(Data.searchData.data);

        switch (checkPassword) {
            case -1:
                window.alert("Пароль неверный!")
            break;
            case 1:
                for (let i = 0; i < printData.length; i++) {
                    printData[i].login = await AES().decrypt(printData[i].login, password)
                    printData[i].password = await AES().decrypt(printData[i].password, password)
                }

                let printWindow =  window.open("","_blank","width=800,height=600");

                printWindow.document.write("<style>div{ font-size:22px; margin-top:10px; display:flex; justify-content:space-between}</style>")

                printData.forEach(item =>{
                    printWindow.document.write(`<div><p>URL: ${item.url}</p><p>login: ${item.login}</p><p>password: ${item.password}</p></div>`)
                })

                printWindow.print()

            break;
        }
    }
    
    return(
        <div className="h-screen flex flex-1 flex-col justify-between items-center bg-neutral-600">
            <div>
                <input onChange={(ev) => {SearchRecs(ev.target.value)}} className="w-96 px-3 py-1 mb-9 mt-5 text-2xl rounded-2xl" type="search"></input> 
                <Link to="/">Домой</Link>
            </div>
            <div className="scrolling max-w-3xl w-full h-full mx-5 mb-5 bg-neutral-600 overflow-y-scroll">
                {
                Data.searchData == undefined ? 
                    Data.data.data.map((item,index) =>{
                        return <SiteObj url={item.url} login={item.login} password={item.password} key={index} id={index}/>
                    })
                    :
                    Data.searchData.data.map((item, index) =>{
                        return <SiteObj url={item.url} login={item.login} password={item.password} key={index} id={index}/>
                    })
                }
            </div>
            <div className="flex w-full justify-around">
                <button onClick={() =>{setVisible(visible ? false : true)}} className="bg-purple-400 px-5 py-4 my-2 rounded-2xl font-semibold">Добавить</button>
                <button onClick={() =>{setSaveVisible(saveVisible ? false : true)}} className="bg-purple-400 px-5 py-4 my-2 rounded-2xl font-semibold">Сохранить изменения</button>
                <button onClick={() =>{MakeCopy()}} className="bg-purple-400 px-5 py-4 my-2 rounded-2xl font-semibold">Печать</button>
            </div>
            {visible ?
                <div className="fixed bg-opacity-50 bg-zinc-500 w-screen h-screen flex items-center justify-center">
                    <AddModal close={setVisible}/>   
                </div>
            : 
                null
            }
            {saveVisible ?
                <div className="fixed bg-opacity-50 bg-zinc-500 w-screen h-screen flex items-center justify-center">
                    <ConfirmModal close={setSaveVisible}/>
                </div>
            : 
                null
            }
        </div>
    )
})