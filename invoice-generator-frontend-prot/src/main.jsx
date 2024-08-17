import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Recorder from "./components/pages/Recorder.jsx";
import Download from "./components/pages/Download.jsx";
import MainPage from "./components/shared/MainPage.jsx";
import TestPage from "./components/pages/TestPage.jsx";
import EditPage from "./components/pages/EditPage.jsx";
import ErrorPage from "./components/pages/ErrorPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <Recorder/>,
            },
            {
                path: "/download",
                element: <Download/>
            },
            {
                path: "/test",
                element: <TestPage/>
            },
            {
                path: "/edit",
                element: <EditPage/>,
            }
        ]
    },
    // {
    //     path: "/download/:invoiceText",
    //     element: <Download/>
    // }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
