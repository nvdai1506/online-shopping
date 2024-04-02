import React, { useContext, useEffect, useState } from 'react'

import CatalogForm from '../components/catalog/CatalogForm';
import CatalogList from '../components/catalog/CatalogList';
import StatusMess from '../components/ui/StatusMess';

import Api from '../service/api';

import classes from './Catalog.module.css';

import CatalogContext from '../context/catalog-context';
import ChildForm from '../components/catalog/ChildForm';

function Catalog() {
  const [catalogs, setCatalogs] = useState([]);

  const catalogCtx = useContext(CatalogContext);
  const { statusHandler, status } = catalogCtx;


  useEffect(() => {
    // console.log('effect');
    // console.log(status);
    Api.shop.getCatalog()
      .then(result => {
        return result.json();
      })
      .then(data => {
        setCatalogs(data.catalogs);
      })
      .catch(err => {
        statusHandler({ error: 'Could not load Catalogs' });
      }
      );
  }, [status])

  return (

    <div className={classes.main}>
      <div className={classes.form}>
        <CatalogForm />
        <ChildForm catalogs={catalogs}/>
      </div>
      <div className={classes.status}>
        {status.error && <StatusMess state='error'>{status.error}</StatusMess>}
        {status.success && <StatusMess state='success'>{status.success}</StatusMess>}
      </div>
      <CatalogList catalogs={catalogs} />
    </div>

  )
}

export default Catalog