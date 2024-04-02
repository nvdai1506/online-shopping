import React, { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom';

const CatalogContext = React.createContext({
    // catalog+child
    status: {},
    editValue: {},
    editChildValue: {},
    editHandler: (value) => { },
    editChildHandler: (value) => { },
    statusHandler: () => { },
});


const CatalogContextProvider = (props) => {
    // catalog+child
    const [editValue, setEditValue] = useState({});
    const [editChildValue, setEditChildValue] = useState({});
    const [status, setStatus] = useState({});

    const editHandler = (value) => {
        setEditValue(value);
    };
    const editChildHandler = (value) => {
        setEditChildValue(value);
    };
    const statusHandler = useCallback((value) => {
        setStatus(value);
    },[]);

    const contextValue = {
        editValue: editValue,
        editChildValue: editChildValue,
        status: status,
        editHandler: editHandler,
        editChildHandler: editChildHandler,
        statusHandler: statusHandler,
    }

    return (
        <CatalogContext.Provider value={contextValue}>
            {props.children}
        </CatalogContext.Provider>
    )
}

export const CatalogContextLayout = ()=>{
    return (
        <CatalogContextProvider>
            <Outlet/>
        </CatalogContextProvider>
    );
}
export default CatalogContext;