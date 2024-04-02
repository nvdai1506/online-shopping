import React, { useState, useRef, useMemo, useCallback, useContext, useEffect, memo } from 'react'
import { AgGridReact } from 'ag-grid-react';

import classes from './ProductList_Aggrid.module.css';
import ProductContext from '../../context/product-context';

import DeleteBtn from './actions/DeleteBtn.js';
import FeaturedProduct from './actions/FeaturedProduct';
import Sale from './actions/Sale';

function ProductList_Aggrid(props) {
    const products = props.products;
    const productCtx = useContext(ProductContext);
    const { productEditHandler, productStatus } = productCtx;



    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [columnDefs] = useState([
        { field: '_id', headerName: '#', editable: true },
        { field: 'title' },
        { field: 'parentCatalog.name', headerName: 'Catalog' },
        { field: 'childCatalog.title', headerName: 'Type' },
        { field: 'totalSoldProducts', headerName: 'Total Of Sales' },
        { field: 'material' },
        { field: 'size' },
        { field: 'price' },
        { field: 'description', },
        {
            colId: 'delete', minWidth: 150, cellRenderer: memo(DeleteBtn),
            floatingFilter: null, cellStyle: { 'textAlign': 'center' }
        },
        {
            field: 'featuredProduct', colId: 'featuredProduct', headerName: 'Featured'
            , cellRenderer: memo(FeaturedProduct),
            floatingFilter: null, filter: null
        },
        {
            field: 'sale', colId: 'sale', headerName: 'Sale(%)',
            cellRenderer: memo(Sale),
            onCellValueChanged: ({ newValue }) => { console.log(newValue) },
            cellStyle: { 'border': 'none' }
        },
    ]);


    const onGridReady = useCallback(() => {
        // console.log('onGridReady');

        const ready = new Promise((resolve, reject) => {
            if (products.length > 0) {
                setRowData(products);
                return resolve();
            }
        });
        ready.then(() => {
            gridRef.current.api.sizeColumnsToFit(
                {
                    defaultMinWidth: 50,
                    columnLimits: [
                        { key: '_id', minWidth: 100 },
                        { key: 'title', minWidth: 150 },
                        { key: 'parentCatalog.name', minWidth: 100 },
                        { key: 'description', minWidth: 300 },
                    ],
                }
            );
        });

    }, [products])

    useEffect(() => {
        // console.log('effect');
        onGridReady();
    }, [productStatus, onGridReady])

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        floatingFilter: true,
    }), []);


    const cellClickedListener = useCallback(event => {
        const colId = event.column.colId;
        if (colId === 'delete' || colId === 'featuredProduct' || colId === 'sale') {
            return;
        }
        // console.log(event.data);
        productEditHandler({
            'parentCatalog': event.data.parentCatalog._id,
            'childCatalog': event.data.childCatalog._id,
            'id': event.data._id,
            'image': `${process.env.REACT_APP_DOMAIN}/${event.data.imageUrl}`,
            'title': event.data.title,
            'material': event.data.material,
            'size': event.data.size,
            'price': event.data.price,
            'description': event.data.description,
        });
    }, [productEditHandler]);

    return (
        <div className={`${classes.main} ag-theme-alpine`}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                animateRows={true}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                onCellClicked={cellClickedListener}
            >
            </AgGridReact>
        </div>
    )
}

export default React.memo(ProductList_Aggrid);