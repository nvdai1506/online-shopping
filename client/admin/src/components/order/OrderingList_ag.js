import React, { useState, useRef, useMemo, useCallback, useEffect, memo } from 'react'
import { AgGridReact } from 'ag-grid-react';
import Button from '../ui/Button';
import classes from './OrderingList_ag.module.css';
import Api from '../../service/api';

function OrderingList_ag(props) {
    const { status, statusChangeHandler, viewHandler } = props;
    const buttonField = {
        colId: 'action',
        floatingFilter: null, resizable: null,
        cellRenderer: memo((p) => {
            const onMarkDone = () => {
                Api.admin.updateOrder({ status: 1 }, p.data._id)
                    .then(result => {
                        if (result.status === 200) {
                            onGridReady();
                        }
                    })
                    .catch(err => {
                        statusChangeHandler(true);
                    });
            }
            const onCancel = () => {
                Api.admin.updateOrder({ status: 2 }, p.data._id)
                    .then(result => {
                        if (result.status === 200) {
                            statusChangeHandler(false);
                        }
                    })
                    .catch(err => {
                        statusChangeHandler(true);
                    });
            }
            return (
                <div className={classes.btn}>
                    <Button state='cancel' onClick={onCancel}>Cancel</Button>
                    <Button onClick={onMarkDone}>Done</Button>
                </div>
            );
        }), cellStyle: { 'textAlign': 'center' }
    }

    const gridRef = useRef();
    const [rowData, setRowData] = useState([]);
    const [columnDefs] = useState([
        { field: 'email' },
        { field: 'created' },
        { field: 'total' },
        buttonField
    ]);

    const onGridReady = useCallback(() => {
        Api.admin.getOrders(0)
            .then(result => { return result.json() })
            .then(data => {
                const orders = data.orders;
                // console.log(orders);
                const newOrders = [];
                for (const o of orders) {
                    const splitDate = o.createdAt.split('T');
                    const date = splitDate[0];
                    const time = (splitDate[1].split('.')[0])
                    const formatTime = date + ' ' + time;
                    newOrders.push({
                        email: o.shippingInfo.email,
                        created: formatTime,
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
                            { key: 'email', minWidth: 200 },
                            { key: '', minWidth: 400 },
                        ],
                    }
                );
            })
            .catch(err => {
                statusChangeHandler(true);
            });
    }, [statusChangeHandler])

    useEffect(() => {
        onGridReady();

    }, [status, onGridReady])

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        // cellStyle:{'background-color':blue}
    }), []);

    const CellDoubleClickedHandler = useCallback(event => {
        const colId = event.column.colId;
        if (colId === 'action') {
            return;
        }
        viewHandler(event.data.items, event.data.total);
    }, [viewHandler]);

    return (
        <div className={`${classes.main} ag-theme-alpine`}>
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

export default React.memo(OrderingList_ag)