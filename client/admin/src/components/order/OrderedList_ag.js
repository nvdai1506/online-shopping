import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react';
import classes from './OrderingList_ag.module.css';
import Api from '../../service/api';
function OrderedList_ag(props) {
    const { status, statusChangeHandler, viewHandler } = props;


    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [columnDefs] = useState([
        { field: 'email' },
        { field: 'created' },
        { field: 'updated' },
        { field: 'total' }
    ]);

    function formatTime(timeString) {
        const splitDate = timeString.split('T');
        const date = splitDate[0];
        const time = splitDate[1].split('.')[0];
        const formatedTime = date + ' ' + time;
        return formatedTime;
    }
    const onGridReady = useCallback(() => {
        Api.admin.getOrders(1)
            .then(result => { return result.json() })
            .then(data => {
                const orders = data.orders;
                const newOrders = [];
                for (const o of orders) {
                    const created = formatTime(o.createdAt);
                    const updated = formatTime(o.updatedAt);
                    newOrders.push({
                        email: o.shippingInfo.email,
                        created: created,
                        updated: updated,
                        total: o.cart.totalPrice,
                        items: o.cart.items,
                        _id: o._id
                    })
                }
                setRowData(newOrders);
                gridRef.current.api.sizeColumnsToFit(
                    {
                        defaultMinWidth: 50,
                        columnLimits: [
                            { key: 'email', minWidth: 200 }
                        ],
                    }
                );
            })
            .catch(err => {
                statusChangeHandler(true);
            });
    }, [statusChangeHandler])

    useEffect(() => {
        // console.log(status);
        onGridReady();

    }, [status, onGridReady])

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
    }), []);
    const CellDoubleClickedHandler = useCallback(event => {
        viewHandler(event.data.items, event.data.total);
    }, [viewHandler]);

    return (
        <div className={`ag-theme-alpine ${classes.main}`}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                animateRows={true}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                onCellDoubleClicked={CellDoubleClickedHandler}
            >
            </AgGridReact>
        </div>
    )
}

export default React.memo(OrderedList_ag)