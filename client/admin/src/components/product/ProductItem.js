import React, { useContext } from 'react'
import classes from './ProductItem.module.css';

import Button from '../ui/Button';
import Api from '../../service/api';
import ProductContext from '../../context/product-context';

function ProductItem(props) {
    const productCtx = useContext(ProductContext);
    const onEditClickHandler = event => {
        productCtx.productEditHandler({
            'parentCatalog':props.parentCatalog,
            'childCatalog': props.childCatalog,
            'id':props.id,
            'image': `${process.env.REACT_APP_DOMAIN}/${props.image}`,
            'title': props.title,
            'material': props.material,
            'size': props.size,
            'price': props.price,
            'description': props.description,
        });
    }
    const onDeleteClickHandler = event => {
        Api.admin.deletetProduct(props.id)
            .then(result => {
                return result.json();
            })
            .then(data => {
                productCtx.productStatusHandler({ success: "You have successfully deleted product." })
            })
            .catch(err => {
                productCtx.productStatusHandler({ error: "Could not delete Product!" })
            });
    }
    return (
        <tr className={classes.main}>
            <td className={classes.titles_title}>{props.title}</td>
            <td className={classes.titles_material}>{props.material}</td>
            <td className={classes.titles_size}>{props.size}</td>
            <td className={classes.titles_price}>{props.price}</td>
            <td className={classes.titles_decription}>{props.description}</td>
            <td className={classes.titles_action}>
                <Button className={classes.btn} onClick={onEditClickHandler}>Edit</Button>
                <Button className={classes.btn} onClick={onDeleteClickHandler}>Delete</Button>
            </td>
        </tr>
    )
}

export default ProductItem