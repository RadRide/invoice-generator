import React from 'react';
import {Outlet} from "react-router-dom";
import {EditContextProvider} from "../contexts/EditContext.jsx";

function MainPage() {
    return (
        <div
            className="w-full h-full min-h-screen bg-gray-950 text-white">
            <div className="bg-darkBlueImage bg-cover bg-no-repeat bg-center w-full h-[32rem] flex flex-col items-center justify-center gap-10">
                <h1 className="text-3xl text-lightBlue font-bold lg:text-6xl">
                    AI Invoice Generator
                </h1>
                <p className="px-4 lg:w-1/3 text-white text-center lg:text-xl">
                    Our innovative platform is designed to revolutionize the way you capture, create, and share your
                    thoughts. With just a few simple steps, you can record your voice and seamlessly convert it into
                    a polished PDF invoice.
                </p>
                <a href="#start" className="bg-transparent text-white font-semibold w-[10rem] hover:text-neutral-700 hover:bg-white border border-white rounded-lg py-2 text-center transition-all mt-10">
                    Let's Get Started !
                </a>
            </div>
            <div className="py-10" id="start">
                <EditContextProvider>
                    <Outlet/>
                </EditContextProvider>

            </div>

        </div>
    );
}

export default MainPage;