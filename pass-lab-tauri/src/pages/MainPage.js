import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SiteObj } from "../components/SiteObj";
import { AddModal } from "../components/AddModal";

import Data from "../storage/Data";
import { observer } from "mobx-react-lite";

import "./ScrollBar.css"

export const MainPage = observer(() =>{
    const [visible, setVisible] = useState(false)

    const SearchRecs = (searchString) => {
        Data.findData(searchString)
    }
    
    return(
        <div className="h-screen flex flex-1 flex-col justify-between items-center bg-neutral-600">
            <div>
                <input onChange={(ev) => {SearchRecs(ev.target.value)}} className="w-96 px-3 py-1 mb-9 mt-5 text-2xl rounded-2xl" type="search"></input> 
                <Link to="/">Домой</Link>
            </div>
            <div className="scrolling max-w-3xl w-full h-full mx-5 mb-5 bg-neutral-600 overflow-y-scroll" >
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
            <button onClick={() =>{setVisible(visible ? false : true)}} className="bg-purple-400 px-5 py-4 my-2 rounded-2xl font-semibold">Добавить</button>
            {visible ?
                <div className="fixed bg-opacity-50 bg-zinc-500 w-screen h-screen flex items-center justify-center">
                    <AddModal close={setVisible}/>   
                </div>
            : 
                null
            }
        </div>
    )
})