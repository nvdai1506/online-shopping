import React, { useState, useMemo, useCallback, useRef, useEffect, memo, useContext } from 'react'
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment/moment';

import classes from './VoucherList.module.css';
import Button from '../ui/Button';
import Api from '../../service/api';
import StatusContext from '../../context/status-context';

function VoucherList({ listIsChange, toggleHandler }) {
  const statusCtx = useContext(StatusContext);
  // ag grid
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);

  const [columnDefs] = useState([
    { field: 'captcha', cellStyle: { 'textTransform': 'uppercase' }, editable: true },
    { field: 'percent', headerName: '(%)' },
    { field: 'vnd', headerName: 'VND', minWidth: 100 },
    { field: 'fromDate', headerName: 'From' },
    { field: 'toDate', headerName: 'To' },
    {
      colId: 'delete', minWidth: 150,
      cellRenderer: memo((p) => {
        const onDeleteHandler = () => {
          Api.admin.deleteVoucher(p.data._id)
            .then(result => {
              if (result.status === 200) {
                statusCtx.setValue('success', 'Voucher is deleted.');
                toggleHandler(p.data._id);
              }
            })
            .catch(err => {
              statusCtx.setValue('error', 'Can not delete this voucher!');
            });
        }
        return <Button className={classes.deletebtn} state='delete' onClick={onDeleteHandler}>Delete</Button>
      }),
      cellStyle: { 'textAlign': 'center' }
    }
  ]);
  const onGridReady = useCallback(() => {
    Api.admin.getVouchers()
      .then(result => {
        return result.json();
      })
      .then(data => {
        const vouchers = data.vouchers;
        // console.log(orders);
        const newVouchers = [];
        for (const v of vouchers) {
          // const fromDate = moment.utc(v.fromDate).format('DD/MM/YYYY HH:mm a')
          // const toDate = moment.utc(v.toDate).format('DD/MM/YYYY HH:mm a')
          const fromDate = moment(v.fromDate).format('DD/MM/YYYY');
          const toDate = moment(v.toDate).format('DD/MM/YYYY');
          newVouchers.push({
            ...v,
            fromDate: fromDate,
            toDate: toDate
          })
        }
        setRowData(newVouchers);
        gridRef.current.api.sizeColumnsToFit(
          {
            defaultMinWidth: 50,
            columnLimits: [
              { key: 'captcha', minWidth: 150 },
              { key: 'fromDate', minWidth: 150 },
              { key: 'toDate', minWidth: 150 },
            ],
          }
        );
      })
      .catch(err => {
        statusCtx.setValue('error', 'Could not load vouchers!');
      });
  }, [])


  useEffect(() => {
    onGridReady();
  }, [listIsChange]);


  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true
  }), []);

  return (
    <div className={classes.voucher_list}>
      <div className={`${classes.ag_grid} ag-theme-alpine`}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          animateRows={true}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        >
        </AgGridReact>
      </div>
    </div>
  )
}

export default React.memo(VoucherList);