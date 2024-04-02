import React, { useContext } from 'react'

import classes from './CatalogItem.module.css';
import Button from '../ui/Button';

import Api from '../../service/api';
import CatalogContext from '../../context/catalog-context';


function CatalogItem(props) {
    const catalogCtx = useContext(CatalogContext);
    const onEditHandler = () => {
        catalogCtx.editHandler({ id: props.id, name: props.name, value: props.value });
    };
    const onDeleteHandler = () => {
        Api.admin.deleteCatalog(props.id)
            .then(result => {
                catalogCtx.statusHandler({ success: "Catalog is deleted successfully." });
            })
            .catch(err => {
                catalogCtx.statusHandler({ error: "Could not delete Catalog!" });
            });
    };
    return (

        <div className={classes.main}>
            <div>
                <h3>{props.name}({props.value})</h3>
            </div>
            <div>
                <Button className={classes.btn} onClick={onEditHandler}>Edit</Button>
                <Button className={classes.btn} state='delete' onClick={onDeleteHandler}>Delete</Button>
            </div>
        </div>

    )
}

export default CatalogItem