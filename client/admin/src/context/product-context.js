import React, { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";


const ProductContext = React.createContext({
    // product
    selectValues: {},
    productStatus: {},
    productEditValue: {},
    productEditHandler: () => { },
    productStatusHandler: () => { },
    selectHandler: () => { }
});

export const ProductContextProvider = (props) => {

    // product
    const [productStatus, setProductStatus] = useState({});
    const [productEditValue, setProductEditValue] = useState({});
    const [selectValues, setSelectValues] = useState({});


    const productStatusHandler = useCallback((value) => {
        setProductStatus(value);
    },[]);
    const productEditHandler = (value) => {
        setProductEditValue(value);
    };
    const selectHandler = value =>{
        setSelectValues(value);
    }

    const contextValues = {
        // product
        selectValues:selectValues,
        productStatus: productStatus,
        productEditValue: productEditValue,
        productEditHandler: productEditHandler,
        productStatusHandler: productStatusHandler,
        selectHandler:selectHandler
    }
    return (
        <ProductContext.Provider value={contextValues}>
            {props.children}
        </ProductContext.Provider>
    );
}
export const ProductContextLayout = ()=>{
    return (
        <ProductContextProvider>
            <Outlet />
        </ProductContextProvider>
    );
}
export default ProductContext;