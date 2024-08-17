import React, {useContext, useEffect, useState} from 'react';
import Visualizer from "../soundVisualizer/Visulizer.jsx";
import 'regenerator-runtime/runtime';
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {Link, useNavigate} from "react-router-dom";
import {EditContext} from "../contexts/EditContext.jsx";

function Recorder() {

    const navigate = useNavigate();

    const [language, setLanguage] = useState("en-US");

    function handleLanguageChange(e) {
        setLanguage(e.target.value);
    }

    const startListening = () => SpeechRecognition.startListening({continuous: true, language: language});
    const stopListening = () => {
        SpeechRecognition.stopListening();
        setInvoiceText(transcript);
    }
    const clear = () => {
        resetTranscript();
        setInvoiceText("");
    }
    const {transcript, resetTranscript} = useSpeechRecognition();

    const {invoiceText, setInvoiceText} = useContext(EditContext);

    function handleInvoiceChange(e) {
        setInvoiceText(e.target.value);
    }

    function onSend(){
        if(invoiceText === ""){
            alert("The invoice is still empty");
        }else{
            navigate(`/edit`);
        }
    }

    useEffect(() => {
        setInvoiceText(transcript);
    }, [transcript]);

    return (
        <div
            className="h-full bg-transparent flex flex-col items-center p-0 m-0 py-10">
            <div className="flex flex-col gap-4 items-center justify-center">
                <h1 className="text-3xl text-lightBlue font-bold lg:text-6xl flex-1">
                    Instructions
                </h1>
                <p className="px-4 md:w-1/3 text-white text-center md:text-xl">
                    Select rhe language you want to use. Then, press on the mic below to start recording you
                    voice which will be dictated in the space below.
                    To stop the recording, press on the mic again.
                </p>

                <select className="select select-bordered bg-gray-800 w-full max-w-xs" value={language} onChange={(e) => handleLanguageChange(e)}>
                <option value="en-US">English (USA)</option>
                <option value="ar-LB">Arabic (Lebanese)</option>
                </select>

            </div>

            <div className="flex relative w-full min-h-[400px] lg:min-h-[600px] max-h-[800px] p-0 m-0">
                <Visualizer startListening={startListening} stopListening={stopListening}/>
            </div>
            <div className="w-11/12 flex flex-col gap-2 py-1 items-center">
                <button className="btn w-[15rem] bg-transparent hover:bg-white text-white hover:text-neutral-700"
                        onClick={clear}>Click To Reset Recording
                </button>
                <textarea
                    className="textarea textarea-bordered bg-gray-800 text-xl text-white text-center w-full h-[20rem] mt-20 border border-white focus:border-white"
                    placeholder="Invoice Content" value={invoiceText}
                    onChange={(e) => handleInvoiceChange(e)}/>
                <div className="flex items-end justify-end w-full">
                    <button className="btn btn-success text-white w-full md:w-[15rem]" onClick={onSend}>Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Recorder;