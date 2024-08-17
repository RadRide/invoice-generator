import React, {useContext} from 'react';

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import {EditContext} from "../contexts/EditContext.jsx";

function TestPage() {

    const {title, setTitle, sender, setSender, receiver, setReceiver, currency, setCurrency, itemList, setItemList} = useContext(EditContext);

    const [pdfFile, setPdfFile] = React.useState("test-pdf.pdf");
    const newPlugin = defaultLayoutPlugin();
    return (
        // <div className="flex flex-col items-center justify-center w-full h-[50rem]">
        //     <div className="overflow-y-auto w-11/12 md:w-1/3 h-full rounded-xl border border-neutral-600">
        //         <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        //             <Viewer fileUrl="src/components/pages/test-pdf.pdf" plugins={[newPlugin]} theme="dark"/>
        //         </Worker>
        //     </div>
        // </div>
        <div>
            {title}
        </div>
    );
}

export default TestPage;