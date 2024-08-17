import React, {createContext, useEffect} from 'react';

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

let EditContext = createContext();

function EditContextProvider({children}) {

    const [title, setTitle] = React.useState('');
    // const [title, setTitle] = React.useState(() => {
    //     try{
    //         const savedState = sessionStorage.getItem("title");
    //         return savedState ? JSON.parse(savedState) : { key: ''};
    //     }catch (error){
    //         console.log(error);
    //         return '';
    //     }
    // });
    const [sender, setSender] = React.useState('');
    const [receiver, setReceiver] = React.useState('');
    const [currency, setCurrency] = React.useState('$');
    const [itemList, setItemList] = React.useState(items);
    const [invoiceText, setInvoiceText] = React.useState(() => {
        try{
            const savedState = sessionStorage.getItem("invoiceText");
            return savedState ? JSON.parse(savedState) : '';
        }catch (error){
            console.log(error);
            return '';
        }
    });

    useEffect(() => {
        sessionStorage.setItem("invoiceText", JSON.stringify(invoiceText));
    }, [invoiceText]);

    function validateInputs(){
        return title !== '' && sender !== '' && receiver !== '' && currency !== '' && itemList.length > 0;
    }

    return (
        <EditContext.Provider value={{invoiceText, setInvoiceText, title, setTitle, sender, setSender, receiver,
            setReceiver, currency, setCurrency, itemList, setItemList, validateInputs}}>
            {children}
        </EditContext.Provider>
    );
}
export  {EditContext, EditContextProvider};