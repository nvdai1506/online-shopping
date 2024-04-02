import React, { useCallback, useContext, useEffect, useState} from 'react'
import classes from './ProductForm.module.css';

import Select from '../ui/Select.js';
import ProductTextForm from './ProductTextForm';

import ProductContext from '../../context/product-context';

function ProductForm(props) {

  const productCtx = useContext(ProductContext);
  const { productEditValue } = productCtx;
  const updateMode = Object.keys(productEditValue).length !== 0;

  const [childs, setChilds] = useState([]);
  const [catalogSelectValue, setCatalogSelectValue] = useState(0);
  const [childSelectValue, setChildSelectValue] = useState(0);

  const catalogs = props.selectValues || [];

  const [imageUrl, setImageUrl] = useState(null);
  const [imageToSend, setimageToSend] = useState(null);

  useEffect(() => {
    if (updateMode) {
      for (const catalog of catalogs) {
        if (catalog._id.toString() === productEditValue.parentCatalog.toString()) {
          setImageUrl(productEditValue.image);
          setCatalogSelectValue(catalog._id);
          setChilds(catalog.ChildCatalogs);
          setChildSelectValue(productEditValue.childCatalog);
          return;
        }
      }
    }
  }, [updateMode, productEditValue]);

  const onChangeSelectCatalogHandler = useCallback(event => {
    setCatalogSelectValue(event.target.value);
    for (const catalog of catalogs) {
      if (catalog._id.toString() === event.target.value.toString()) {
        setChilds(catalog.ChildCatalogs);
        return;
      }
    }
  });
  const onChangeSelectChildHandler = event => {
    setChildSelectValue(event.target.value);
  };
  const onChangeFileHandler = event => {
    if (event.target.files && event.target.files[0]) {
      setImageUrl(URL.createObjectURL(event.target.files[0]));
      setimageToSend(event.target.files[0]);
    }
  };

  const resetHandler = () => {
    setCatalogSelectValue(0);
    setChildSelectValue(0);
    setImageUrl(null);
  }

  const onClickCatalogHandler = event => {
    productCtx.productStatusHandler({});
  }

  return (

    <div className={classes.main}>
      <div className={classes.dynamicForm}>
        <div className={classes.select}>
          <Select
            title='Select Catalog'
            className={classes.select_item}
            onChange={onChangeSelectCatalogHandler}
            values={catalogs}
            value={catalogSelectValue}
            onClick={onClickCatalogHandler}
          />

          <Select
            title='Select Child'
            className={classes.select_item}
            onChange={onChangeSelectChildHandler}
            values={childs}
            value={childSelectValue}
            onClick={onClickCatalogHandler}
          />

        </div>
        <div className={classes.image}>
          <input onChange={onChangeFileHandler} type='file' className={classes.customFileInput} />
          <div className={classes.image_show}>
            <img crossOrigin='true' src={imageUrl} alt=''></img>
          </div>
        </div>
      </div>
      <div className={classes.textForm}>
        <ProductTextForm parentSelectValue={catalogSelectValue} childSelectValue={childSelectValue} imageUrl={imageUrl} imageToSend={imageToSend} reset={resetHandler} />
      </div>
    </div>
  )
}

export default React.memo(ProductForm);