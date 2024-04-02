import React, { useContext } from 'react'

import Card from '../ui/Card';

import CatalogItem from './CatalogItem';
import ChildItem from './ChildItem';
import classes from './CatalogList.module.css'
import ErrorMess from '../ui/StatusMess';

import CatalogContext from '../../context/catalog-context';
function CatalogList(props) {
    const catalogCtx = useContext(CatalogContext);
    return (
        <div className={classes.main}>
            {catalogCtx.error && <ErrorMess state='error'>Could not load Catalogs</ErrorMess>}
            {props.catalogs.map((catalog) => (
                <Card key={catalog._id}>
                    <CatalogItem key={`${catalog._id}_catalog`} id={catalog._id} name={catalog.name} value={catalog.value} />
                    {catalog.ChildCatalogs.map(child => (<ChildItem key={`${child._id}_children`} parent={catalog._id} id={child._id} title={child.title} value={child.value} />))}
                </Card>

            ))}
        </div>
    )
}

export default CatalogList