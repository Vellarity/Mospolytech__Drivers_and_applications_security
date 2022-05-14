import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";


export const FaceLogPage = () =>{
    const videoEl = useRef(null)

   /*  useEffect(async() =>{
       LoadModels().then(() =>{
           CreateCanvas()
           StartDetection()
       })

    },[]) */

    useEffect(() => {
        GetVideo();
    }, [videoEl]);

    const GetVideo = () => {
        navigator.mediaDevices
          .getUserMedia({ video: {width: { min: 1280 }, height: { min: 720 }} })
          .then(stream => {
            let video = videoEl.current;
            video.srcObject = stream;
            video.play();
          })
          .catch(err => {
            console.error("error:", err);
          });
    };
    
    return(
        <div className="h-screen flex flex-col justify-around items-center bg-neutral-600">
            <video className="rounded-2xl -scale-x-100" ref={videoEl} height="400" width="400" autoplay muted/>
            <Link className="no-underline bg-red-400 px-5 py-3 rounded-2xl font-semibold pointer-events-none" to="/mainPage">
                Войти
            </Link>

        </div>
    )
}