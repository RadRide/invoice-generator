import React, {useContext, useEffect} from 'react';
import {
    HiOutlineChevronDoubleDown,
    HiOutlineChevronDoubleUp,
    HiOutlineCurrencyDollar,
    HiOutlineDocument,
    HiOutlinePencilAlt,
    HiOutlinePlus,
    HiOutlineSwitchVertical,
    HiOutlineTag,
    HiOutlineTrash,
    HiPaperClip
} from "react-icons/hi";
import {Link, useNavigate} from "react-router-dom";
import {EditContext} from "../contexts/EditContext.jsx";
import axios from "axios";
import {apiEditUrl} from "../../utils/urls.js";

const items = [
    {
        id: 1,
        name: "item 1",
        quantity: 23,
        cost: 249.56
    },
    {
        id: 2,
        name: "item 2",
        quantity: 23,
        cost: 249.56
    },
    {
        id: 3,
        name: "item 3",
        quantity: 23,
        cost: 249.56
    },
]

function EditPage() {

    const {title, setTitle, sender, setSender, receiver, setReceiver, currency, setCurrency, itemList, setItemList, invoiceText, validateInputs} = useContext(EditContext);
    const [isLoading, setIsLoading] = React.useState(true);
    const navigate = useNavigate();

    function handleTitleChange(e){
        setTitle(e.target.value.charAt(0).toUpperCase() + e.target.value.substring(1));
    }

    function handleReceiverChange(e){
        setReceiver(capitalize(e.target.value));
    }
    function handleSenderChange(e){
        setSender(capitalize(e.target.value));
    }

    function handleCurrencyChange(e){
        setCurrency(e.target.value.toUpperCase());
    }

    function handleItemNameChange(e, id){
        let updatedList = itemList.map(item => {
            if(item.id == id){
                return {...item, name: capitalize(e.target.value)};
            }
            return item;
        });
        setItemList(updatedList);
    }
    function handleItemQuantityChange(e, id){
        let updatedList = itemList.map(item => {
            if(item.id == id){
                return {...item, quantity: e.target.value};
            }
            return item;
        });
        setItemList(updatedList);
    }
    function handleItemCostChange(e, id){
        let updatedList = itemList.map(item => {
            if(item.id == id){
                return {...item, cost: e.target.value};
            }
            return item;
        });
        setItemList(updatedList);
    }
    function handleDeleteItem(id){
        setItemList(i => i.filter(item => item.id !== id));
    }
    function handleAddItem(){
        setItemList(i => [...i, {id: i.length + 1, name: "New Item", quantity: 0, cost: 0}]);
    }

    function capitalize(input){
        const inputArray = input.split(" ");
        return inputArray.map(i => i.charAt(0).toUpperCase() + i.substring(1)).join(" ");
    }

    const getItems = async () => {
        try{
            setIsLoading(true);
            const response = await axios.post(apiEditUrl, invoiceText,{
                headers: {'accept': '*/*', 'Content-Type': 'application/json'}
            });

            if(response.status === 200){
                console.log(response.data)
                const invoiceData = response.data;

                setTitle(invoiceData.title);
                setReceiver(invoiceData.receiver);
                setSender(invoiceData.sender);
                setCurrency(invoiceData.currency);
                setItemList(invoiceData.items);
            }else{
                alert(response.data.value)
            }
            setIsLoading(false);
        }catch (error){
            console.log(error);
        }
    }

    function onSubmit(){
        if(validateInputs){
            navigate("/download");
        }else{
            alert("All fields must be filled and at least one item is available")
        }
    }

    useEffect(() => {
        if(invoiceText !== '') {
            getItems();
        }else{
            setIsLoading(false)
            console.log("Invoice text is empty")
        }
    }, [])

    return (
        <div className="w-screen h-full flex items-center justify-center px-4">

            {
                isLoading ?
                    <span className="loading loading-spinner loading-lg"></span>
                    :
                    <div className="w-11/12 flex flex-col gap-8 xl:w-1/2 h-full">
                        <div>
                            <div className="divider before:bg-gray-800 after:bg-gray-800 text-lg font-semibold">
                                Title
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 overflow-y-auto">
                                <label className="input input-bordered flex items-center gap-2 bg-gray-800 w-full">
                                    <HiPaperClip/>
                                    <input type="text" className="grow" placeholder="Title" value={title}
                                           onChange={(e) => handleTitleChange(e)}/>
                                </label>
                                <label className="input input-bordered flex items-center gap-2 bg-gray-800">
                                    <HiOutlineCurrencyDollar/>
                                    <input type="text" className="grow" placeholder="Currency" value={currency}
                                           onChange={(e) => handleCurrencyChange(e)}/>
                                </label>
                            </div>
                        </div>

                        <div>
                            <div className="divider before:bg-gray-800 after:bg-gray-800 text-lg font-semibold">
                                To / From
                            </div>
                            <div className="flex flex-col gap-4 md:flex-row">
                                <label className="input input-bordered flex items-center gap-2 bg-gray-800 w-full">
                                    <HiOutlineChevronDoubleUp/>
                                    <input type="text" className="grow" placeholder="Sender" value={sender}
                                           onChange={(e) => handleSenderChange(e)}/>
                                </label>
                                <label className="input input-bordered flex items-center gap-2 bg-gray-800 w-full">
                                    <HiOutlineChevronDoubleDown/>
                                    <input type="text" className="grow" placeholder="Receiver" value={receiver}
                                           onChange={(e) => handleReceiverChange(e)}/>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="divider before:bg-gray-800 after:bg-gray-800 text-lg font-semibold">
                                Items
                            </div>
                            <div className="flex flex-col gap-4 overflow-x-auto w-full">
                                {
                                    itemList.map(item => {
                                        return (
                                            <div className="flex gap-4" key={item.id}>
                                                <label
                                                    className="input input-bordered flex items-center gap-2 bg-gray-800 w-full">
                                                    <HiOutlinePencilAlt/>
                                                    <input type="text" className="grow" placeholder="Item Name"
                                                           value={item.name}
                                                           onChange={(e) => handleItemNameChange(e, item.id)}/>
                                                </label>
                                                <label
                                                    className="input input-bordered flex items-center gap-2 bg-gray-800">
                                                    <HiOutlineSwitchVertical/>
                                                    <input type="number" className="grow w-[5rem]"
                                                           placeholder="Qunatity"
                                                           value={item.quantity}
                                                           onChange={(e) => handleItemQuantityChange(e, item.id)}/>
                                                </label>
                                                <label
                                                    className="input input-bordered flex items-center gap-2 bg-gray-800">
                                                    <HiOutlineTag/>
                                                    <input type="number" className="grow w-[5rem]" placeholder="Cost"
                                                           value={item.cost}
                                                           onChange={(e) => handleItemCostChange(e, item.id)}/>
                                                </label>
                                                <button className="bg-gray-800 px-5 py-3 rounded-lg hover:bg-white hover:text-gray-800 transition-all" onClick={() => handleDeleteItem(item.id)}>
                                                    <HiOutlineTrash fontSize={18}/>
                                                </button>
                                            </div>
                                        );
                                    })
                                }
                                <div className="flex justify-end ">
                                    <button className="bg-gray-800 px-5 py-3 rounded-lg hover:bg-white hover:text-gray-800 transition-all" onClick={handleAddItem}>
                                        <HiOutlinePlus fontSize={18}/>
                                    </button>
                                </div>
                            </div>
                            <button className="bg-gray-800 py-3 px-5 w-full md:w-fit rounded-lg hover:bg-white hover:text-gray-800 transition-all flex justify-center items-center gap-2" onClick={onSubmit}>
                                <HiOutlineDocument/>
                                Generate PDF
                            </button>
                        </div>
                    </div>
            }
        </div>
    );
}

export default EditPage;