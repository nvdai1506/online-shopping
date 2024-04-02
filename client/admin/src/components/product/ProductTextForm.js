import React, { useContext, useEffect, useState } from 'react'
import classes from './ProductTextForm.module.css';

import Input from '../ui/Input';
import Button from '../ui/Button';
import useInput from '../../hooks/use-input';
import Api from '../../service/api';
import ProductContext from '../../context/product-context';


const ProductTextForm = (props) => {
    const { parentSelectValue, childSelectValue, imageUrl, imageToSend } = props;
    const productCtx = useContext(ProductContext);

    const { productStatusHandler, productEditValue, productEditHandler } = productCtx;
    const { title, material, size, price, description } = productEditValue;

    const updateMode = Object.keys(productEditValue).length !== 0;

    const {
        value: enteredTitle,
        setValue: setEnteredTitle,
        isValid: enteredTitleIsValid,
        valueChangeHandler: titleChangedHandler,
        reset: resetTitleInput
    } = useInput(value => value.trim() !== '');


    const {
        value: enteredMaterial,
        setValue: setEnteredMaterial,
        isValid: enteredMaterialIsValid,
        valueChangeHandler: materialChangedHandler,
        reset: resetMaterialInput
    } = useInput(value => value.trim() !== '');

    const {
        value: enteredSize,
        setValue: setEnteredSize,
        isValid: enteredSizeIsValid,
        valueChangeHandler: sizeChangedHandler,
        reset: resetSizeInput
    } = useInput(value => value.trim() !== '');

    const {
        value: enteredPrice,
        setValue: setEnteredPrice,
        isValid: enteredPriceIsValid,
        valueChangeHandler: priceChangedHandler,
        reset: resetPriceInput
    } = useInput(value => value >= 0);

    const {
        value: enteredDescription,
        setValue: setEnteredDescription,
        isValid: enteredDescriptionIsValid,
        valueChangeHandler: descriptionChangedHandler,
        reset: resetDescriptionInput
    } = useInput(value => value.trim() !== '');

    const [checkboxValue, setCheckboxValue] = useState(0);
    useEffect(() => {
        if (updateMode) {
            setEnteredTitle(title);
            setEnteredMaterial(material);
            setEnteredSize(size);
            setEnteredPrice(price);
            setEnteredDescription(description);
        }
    }, [updateMode, title, material, size, price, description
        , setEnteredTitle, setEnteredMaterial, setEnteredSize, setEnteredPrice, setEnteredDescription])


    const reset = () => {
        props.reset();
    }
    const resetAll = () => {
        resetTitleInput();
        resetMaterialInput();
        resetSizeInput();
        resetPriceInput();
        resetDescriptionInput();
        reset();
    }
    const onClickHandler = event => {
        productStatusHandler({});
    };
    const onClickCancleHandler = () => {
        productStatusHandler({});
        productEditHandler({});
        resetAll();
    }
    const onDeleteHandler = () => {
        const id = productCtx.productEditValue.id;
        Api.admin.deletetProduct(id)
            .then(result => {
                return result.json();
            })
            .then(data => {
                productCtx.productStatusHandler({ success: "You have successfully deleted product." })
                productCtx.productEditHandler({});
                resetAll();
            })
            .catch(err => {
                productCtx.productStatusHandler({ error: "Could not delete Product!" })
            });
    }
    const checkboxHandler = event => {
        setCheckboxValue(event.target.checked);
    }

    const onSubmitHandler = event => {
        event.preventDefault();
        // console.log(enteredTitleIsValid, enteredMaterialIsValid,
        //     enteredSizeIsValid, enteredPriceIsValid, enteredDescriptionIsValid, parentSelectValue, childSelectValue);
        if (!enteredTitleIsValid || !enteredMaterialIsValid || !enteredSizeIsValid
            || !enteredPriceIsValid || !enteredDescriptionIsValid || parentSelectValue === 0
            || childSelectValue === 0) {
            return productStatusHandler({ error: 'Form is not valid! please, check again.' });
        }

        if (updateMode) {
            let img = '';
            if (imageToSend) {
                img = imageToSend;
            }
            const formData = new FormData();
            formData.append('title', enteredTitle);
            formData.append('material', enteredMaterial);
            formData.append('size', enteredSize);
            formData.append('image', img);
            formData.append('price', enteredPrice);
            formData.append('description', enteredDescription);
            formData.append('childCatalog', childSelectValue);
            formData.append('parentCatalog', parentSelectValue);
            Api.admin.updateProduct(formData, productCtx.productEditValue.id)
                .then(result => {
                    if (result.status === 200) {
                        productEditHandler({});
                        productStatusHandler({ success: 'Product is updated successfully.' })
                        resetAll();
                    }
                })
                .catch(err => {
                    productStatusHandler({ error: 'Update failed!' });
                });
        } else {
            if (!imageUrl) {
                return productStatusHandler({ error: 'Please, upload the image!' });
            }
            const formData = new FormData();
            formData.append('title', enteredTitle);
            formData.append('material', enteredMaterial);
            formData.append('size', enteredSize);
            formData.append('image', imageToSend);
            formData.append('price', enteredPrice);
            formData.append('description', enteredDescription);
            formData.append('childCatalog', childSelectValue);
            formData.append('parentCatalog', parentSelectValue);
            // console.log(formData);
            Api.admin.addProduct(formData)
                .then(result => {
                    return result.json()
                })
                .then(data => {
                    productCtx.productStatusHandler({ success: "You have successfully added Product." });
                    if (!checkboxValue) {
                        resetAll();
                    }
                })
                .catch(err => {
                    productCtx.productStatusHandler({ error: "Could not add Product!" });
                });
        }

    }
    return (
        <form className={classes.form} onSubmit={onSubmitHandler}>
            <Input
                className={classes.input}
                type='text'
                title='Title'
                onClick={onClickHandler}
                value={enteredTitle}
                onChange={titleChangedHandler} />
            <Input
                className={classes.input}
                type='text'
                title='Material'
                onClick={onClickHandler}
                value={enteredMaterial}
                onChange={materialChangedHandler} />
            <Input title='Size'
                type='text'
                className={classes.input}
                onClick={onClickHandler}
                value={enteredSize}
                onChange={sizeChangedHandler} />
            <Input title='Price'
                type='number'
                className={classes.input}
                onClick={onClickHandler}
                value={enteredPrice}
                onChange={priceChangedHandler} />
            <Input title='Description'
                type='text'
                className={classes.input}
                onClick={onClickHandler}
                value={enteredDescription}
                onChange={descriptionChangedHandler} />

            {!updateMode &&
                <Button className={classes.btn} type='submit'>Add</Button>
            }
            {!updateMode &&
                <div>
                    <input type='checkbox' id="keepData" onChange={checkboxHandler} />
                    <label htmlFor='keepData'>Keep Data</label>
                </div>
            }
            {updateMode &&
                <Button className={classes.btn} state='cancel' onClick={onClickCancleHandler}>Cancle</Button>
            }
            {updateMode &&
                <Button className={classes.btn} type='submit'>Update</Button>
            }
            {updateMode &&
                <Button className={`${classes.btn}`} state='delete' onClick={onDeleteHandler}>Delete</Button>
            }


        </form>
    )
}

export default React.memo(ProductTextForm);