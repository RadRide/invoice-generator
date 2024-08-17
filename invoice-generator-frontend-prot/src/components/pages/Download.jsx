import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {HiDownload} from "react-icons/hi";

import {Viewer, Worker} from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import {EditContext} from "../contexts/EditContext.jsx";

function Download() {

    const {title, sender, receiver, currency, itemList} = useContext(EditContext);

    const requestData = {
        title: title,
        sender: sender,
        receiver: receiver,
        currency: currency,
        items: itemList,
    }
    console.log(requestData)

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");

    const newPlugin = defaultLayoutPlugin();

    const retrievePdf = async () => {
        try{
            setIsLoading(true);
            const response = await axios.post("http://localhost:5025/api/invoice", requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setPdfUrl(url);
            setIsLoading(false);
        }catch (error){
            setError(true);
            console.log(error);
        }
    };

    const download = () => {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute('download', "invoice.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    useEffect(() => {
        retrievePdf();
    }, []);

    return (
        <div className="flex flex-col gap-16 justify-center items-center h-full">
            <h1 className="text-2xl text-lightBlue font-bold lg:text-4xl inline-block">
                {
                    isLoading
                        ? "Your Invoice is Being Prepared"
                        : "Press The Button To Download"
                }

            </h1>
            {
                isLoading
                    ? <button
                        className="btn glass text-white hover:text-neutral-700 focus:text-white lg:hover:focus:text-neutral-700">
                        <span className="loading loading-spinner loading-lg"></span>
                        Fetching PDF Document
                    </button>
                    : <button onClick={download}
                        className="btn glass text-white hover:text-neutral-700 focus:text-white lg:hover:focus:text-neutral-700">
                        <HiDownload fontSize={25}/>
                        Download PDF
                    </button>
            }

            {
                !isLoading ?
                    <div className="h-[500px] md:h-[800px] w-11/12 md:w-1/3 overflow-y-auto rounded-xl border border-neutral-600">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <Viewer fileUrl={pdfUrl} plugins={[newPlugin]} theme="dark"/>
                        </Worker>
                    </div>
                    : null
            }
        </div>
    );
}

export default Download;