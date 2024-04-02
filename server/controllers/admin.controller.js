import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import clearImage from '../utils/clearImage.js';

import Catalog from '../models/catalog.model.js';
import ChildCatalog from '../models/childCatalog.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Rate from '../models/rate.model.js';
import Voucher from '../models/voucher.model.js';


import errorHandler from '../utils/errorHandler.js';
import { setCache, getCache, delCache } from '../utils/redis.js';
import pushNotification from '../utils/notification.js';


let admin = () => { }

// management account
admin.getManagementrAccounts = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0 || req.accessTokenPayload.role === 2) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    try {
        const users = await User.find({ role: 2 });

        res.status(200).json({ users: users });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
admin.addManagementAccount = async (req, res, next) => {
    const email = req.body.email;
    if (req.accessTokenPayload.role === 0 || req.accessTokenPayload.role === 2) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    try {
        const isUserExist = await User.findOne({ email: email });
        if (isUserExist) {
            throw errorHandler.throwErr('User is existed.', 422);
        }
        const password = await bcrypt.hash(req.body.password, 12);
        const user = new User({
            email: req.body.email,
            password: password,
            role: 2
        })

        const result = await user.save();

        res.status(201).json({ mess: 'Account is signed up.', id: result._id, email: result.email });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}

admin.deleteManagementAccount = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0 || req.accessTokenPayload.role === 2) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const userId = req.params.userId;
    try {
        const result = await User.findByIdAndDelete(userId);

        res.status(200).json({ result: result });

    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
// Catalog
admin.addCatalog = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const name = req.body.name;
    const value = req.body.value;

    const catalog = new Catalog({
        name,
        value
    })
    try {
        const result = await catalog.save();
        delCache('catalogs');
        res.status(201).json({ mess: "Catalog is added.", id: result._id });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}

admin.updateCatalog = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }

    const id = req.params.id;
    const newName = req.body.name;
    const newValue = req.body.value;
    // console.log(id, newName);
    try {
        const catalog = await Catalog.findById(id);
        if (!catalog) {
            throw next(errorHandler('Could not find Catalog', 422));
        }
        catalog.name = newName;
        catalog.value = newValue;
        await catalog.save();
        delCache('catalogs');
        res.status(200).json({ mess: "Catalog is updated." });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }


}

admin.deleteCatalog = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const id = req.params.id;
    try {
        const result = await Catalog.findByIdAndDelete(id);
        if (!result) {
            throw next(errorHandler.throwErr('Id is in correct.', 422));
        }
        delCache('catalogs');
        res.status(200).json({ mess: "Catalog is deleted!", _id: id });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }


}

// childCatalog
admin.addChildCatalog = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const parentId = req.body.parent;
    const title = req.body.title;
    const value = req.body.value;
    // console.log(value);
    try {
        const child = await ChildCatalog.findOne({ title: title });
        if (child !== null) {
            if (child.parent.toString() === parentId.toString()) {
                throw errorHandler.throwErr('Child already exist.');
            } else {
                child.parent = parentId;
                const result = await child.save();
                const catalog = await Catalog.findById(parentId);
                if (!catalog) {
                    throw errorHandler.throwErr('Could not find parent Catalog!', 422);
                }
                catalog.ChildCatalogs.push(result._id);
                await catalog.save();
                return res.status(201).json({ mess: "ChildCatalog is added.", id: result._id });
            }
        }
        const childCatalog = new ChildCatalog({
            parent: parentId,
            title: title,
            value: value
        });
        const result = await childCatalog.save();
        const catalog = await Catalog.findById(parentId);

        if (!catalog) {
            throw errorHandler.throwErr('Could not find parent Catalog!', 422);
        }
        catalog.ChildCatalogs.push(result._id);
        await catalog.save();
        delCache('ChildCatalogs');
        delCache('catalogs');
        res.status(201).json({ mess: "ChildCatalog is added.", id: result._id });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}

admin.updateChildCatalog = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const childId = req.params.childId;
    const parentId = req.body.parent;
    const newTitle = req.body.title;
    const newValue = req.body.value;

    try {
        const catalog = await Catalog.findById(parentId);
        if (!catalog) {
            throw errorHandler.throwErr('Could not find parent catalog!', 422);
        }


        const child = await ChildCatalog.findById(childId);
        if (!child) {
            throw errorHandler.throwErr('Could not find child catalog!', 422);
        }
        const oldParentId = child.parent;
        if (parentId.toString() !== oldParentId.toString()) {
            catalog.ChildCatalogs.push(childId);
            await catalog.save();
            const oldParent = await Catalog.findById(oldParentId);
            if (oldParent) {
                oldParent.ChildCatalogs.pull(childId);
                await oldParent.save();
            }
        }
        child.parent = parentId;
        child.title = newTitle;
        child.value = newValue;

        await child.save();
        delCache('ChildCatalogs');
        delCache('catalogs');

        res.status(200).json({ mess: "Data is updated.", id: child._id });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}

admin.deleteChildCatalog = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const childId = req.params.childId;
    try {
        const child = await ChildCatalog.findById(childId);
        if (!child) {
            throw errorHandler.throwErr('Could not find child catalog!', 422);
        }
        const parent = await Catalog.findById(child.parent);
        if (parent) {
            parent.ChildCatalogs.pull(childId);
            await parent.save();
        }
        await ChildCatalog.findByIdAndDelete(childId);
        delCache('ChildCatalogs');
        delCache('catalogs');
        res.status(200).json({ mess: `${childId} is deleted.` })
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
// <<<<<<<<<<<<product>>>>>>>>>>>>>>>

admin.addProduct = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    if (!req.file) {
        return next(errorHandler.throwErr('No image provided!', 401));
    }
    const imageUrl = req.file.path.replace("\\", "/");
    // console.log(imageUrl);
    const childCatalogId = req.body.childCatalog;
    try {
        const childCatalog = await ChildCatalog.findById(childCatalogId);
        if (!childCatalog) {
            throw errorHandler.throwErr('Could not find child Catalog!', 422);
        }
        const rate = new Rate({ rate: [] });
        const rate_result = await rate.save();
        const product = new Product({
            title: req.body.title,
            description: req.body.description,
            imageUrl: imageUrl,
            material: req.body.material,
            size: req.body.size,
            price: req.body.price,
            childCatalog: req.body.childCatalog,
            parentCatalog: req.body.parentCatalog,
            rate: rate_result._id
        });
        const productResult = await product.save();
        childCatalog.products.push(product._id);
        await childCatalog.save();
        delCache('getProducts');
        res.status(200).json({ mess: "Product is added.", id: productResult._id });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}

admin.updateProduct = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw errorHandler.throwErr('Could not find product!', 422);
        }
        let imageUrl;
        if (req.file) {
            imageUrl = req.file.path.replace("\\", "/");
            clearImage(product.imageUrl);
        } else {
            imageUrl = product.imageUrl;
        }


        const newTitle = req.body.title;
        const newDescription = req.body.description;
        const newMaterial = req.body.material;
        const newSize = req.body.size;
        const newPrice = req.body.price;
        const newChildCatalog = req.body.childCatalog
        const newParentCatalog = req.body.parentCatalog
        const childCatalog = await ChildCatalog.findById(newChildCatalog);
        if (!childCatalog) {
            throw errorHandler.throwErr('Could not child Catalog!', 422);
        }
        product.title = newTitle;
        product.description = newDescription;
        product.imageUrl = imageUrl;
        product.material = newMaterial;
        product.size = newSize;
        product.price = newPrice;
        product.childCatalog = newChildCatalog;
        product.parentCatalog = newParentCatalog;

        const result = await product.save();
        delCache('getProducts');
        delCache(`getProductById/${productId}`);
        res.status(200).json({ mess: "Product is updated.", id: result._id });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
admin.deleteProduct = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        clearImage(product.imageUrl);
        if (!product) {
            throw errorHandler.throwErr('Could not find product!', 422);
        }
        const childCatalogId = product.childCatalog;
        const childCatalog = await ChildCatalog.findById(childCatalogId);
        if (childCatalog) {
            childCatalog.products.pull(product._id);
            await childCatalog.save();
        }
        const result = await Product.findByIdAndDelete(productId);
        delCache('getProducts');
        delCache(`getProductById/${productId}`);
        if (product.featuredProduct === 1) {
            const parentCatalog = await Catalog.findById(product.parentCatalog);
            if (parentCatalog) {
                delCache(`featuredProducts/${parentCatalog.value}`);
                parentCatalog.featuredProducts.pull(productId);
                await parentCatalog.save();
            }
        }
        res.status(200).json({ mess: `${result._id} is deleted!` });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
// <<<<<<<<<<<<featured product>>>>>>>>>>>>>>>
admin.addFeaturedProduct = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const productId = req.body.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw errorHandler.throwErr('Could not find Product!', 422);
        }
        const parentCatalogId = product.parentCatalog;
        const parentCatalog = await Catalog.findById(parentCatalogId);
        if (!parentCatalog) {
            throw errorHandler.throwErr('Could not find Catalog!', 422);
        }
        if (parentCatalog.featuredProducts.length >= 8) {
            throw errorHandler.throwErr(`Featured products of "${parentCatalog.name}" exceeds the limit of 8 !`, 403);
        }
        product.featuredProduct = 1;
        await product.save();
        parentCatalog.featuredProducts.push(productId);
        const result = await parentCatalog.save();
        // console.log(result.value);
        delCache(`getProducts`);
        delCache(`featuredProducts/${result.value}`);
        res.status(200).json({ featuredProducts: result.featuredProducts });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
admin.deleteFeaturedProduct = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw errorHandler.throwErr('Could not find product!', 422);
        }
        const parentCatalogId = product.parentCatalog;
        product.featuredProduct = 0;
        await product.save();
        const parentCatalog = await Catalog.findById(parentCatalogId);
        if (parentCatalog) {
            parentCatalog.featuredProducts.pull(productId);
            const result = await parentCatalog.save();
            delCache(`featuredProducts/${result.value}`);
            delCache(`getProducts`);
            res.status(200).json({ featuredProducts: result.featuredProducts });
        } else {
            res.status(404).json({ mess: "Not found Catalog!" });
        }

    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}

// on sale
admin.onSale = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const productId = req.params.productId;
    const percent = req.body.percent;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw errorHandler.throwErr('Could not find Product!', 422);
        }
        product.sale = Number(percent);
        const result = await product.save();
        delCache('getProducts');
        const parentCatalog = await Catalog.findById(result.parentCatalog);
        if (parentCatalog) {
            delCache(`featuredProducts/${parentCatalog.value}`);
            parentCatalog.featuredProducts.pull(productId);
        }
        if (percent >= 50) {
            pushNotification('all',
                'Dành tặng khách hàng đã ghé thăm NVD Shop',
                `Sản phẩm "${result.title}" đang giảm giá "${percent}%".\n Click tới sản phẩm >>>>`,
                'sale',
                result._id
            )
        }
        res.status(200).json({ product: result });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}


// order



admin.getOrderByStatus = async (req, res, next) => {
    // console.log(req.params.status);

    if (req.accessTokenPayload.role === 0) {
        // console.log(req.accessTokenPayload.role);
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const status = req.params.status; // 0 1 
    try {
        const orders = await Order.find({ shippingStatus: status, }).populate({ path: 'cart.items.product', select: ['title', 'price'] });
        res.status(200).json({ orders: orders });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
const addDataToSalesFigures = async (object, quantity, price, today) => {
    if (object.salesFigures.length === 0) {
        object.salesFigures.push({
            numProducts: quantity,
            turnovers: price * quantity,
            date: moment().toDate()
        })
    } else {
        const lastSalesFigures = object.salesFigures.slice(-1);
        const lastDay = moment(lastSalesFigures[0].date).format('L');
        const index = object.salesFigures.length - 1;
        if (lastDay === today) {
            object.salesFigures[index].numProducts += quantity;
            object.salesFigures[index].turnovers += price * quantity;
        } else {
            object.salesFigures.push({
                numProducts: quantity,
                turnovers: price * quantity,
                date: moment().toDate()
            })
        }
    }
    try {
        await object.save();
    } catch (error) {
        throw error;
    }
}
admin.updateOrderStatus = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const orderId = req.params.orderId;
    const status = req.body.status;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            throw errorHandler.throwErr('Could not find this order!', 422);
        }
        order.status = status;
        order.shippingStatus = status;
        if (status === 1) {
            for (const item of order.cart.items) {
                const productId = item.id;
                const amount = Number(item.amount);
                try {
                    const product = await Product.findById(productId);
                    // console.log(product);
                    product.totalSoldProducts += Number(amount);
                    await product.save();
                } catch (error) {
                    throw errorHandler.throwErr('Add salesFigures have error!', 422);
                }
            }
        }
        // add to sale figures
        // const today = moment().format('L');
        // if (status === 1)//completed
        // {
        //     for (const item of order.cart.items) {
        //         const productId = item.product;
        //         const amount = Number(item.amount);

        //         try {
        //             const product = await Product.findById(productId);
        //             const price = Number(product.price);



        //             const childCatalogId = product.childCatalog;
        //             const parentCatalogId = product.parentCatalog;

        //             const childCatalog = await ChildCatalog.findById(childCatalogId);
        //             addDataToSalesFigures(childCatalog, amount, price, today);
        //             // await childCatalog.save();

        //             const parentCatalog = await Catalog.findById(parentCatalogId);
        //             addDataToSalesFigures(parentCatalog, amount, price, today);
        //             // await parentCatalog.save();
        //             // await product.save();
        //             addDataToSalesFigures(product, amount, price, today);
        //         } catch (error) {
        //             throw errorHandler.throwErr('Add salesFigures have error!', 422);
        //         }

        //     }
        // }
        const updatedOrder = await order.save();
        res.status(200).json({ mess: 'Order is updated.', updatedOrder: updatedOrder });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
admin.getOverview = async (req, res, next) => {
    let overview = [];
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const startDate = moment(req.body.startDate).format('YYYY-MM-DD');
    const endDate = moment(req.body.endDate).format('YYYY-MM-DD');
    const type = req.body.type;
    // console.log(startDate, '-', endDate, '-', type);
    try {
        const Cache = await getCache(`getOverview/${type}-${startDate}-${endDate}`);
        if (Cache !== null) {
            res.status(200).json({ overview: JSON.parse(Cache) });
        } else {
            if (type === 'catalog') {
                const catalogs = await Catalog.find();
                for (const catalog of catalogs) {
                    overview.push({
                        _id: catalog._id,
                        name: catalog.name,
                        turnovers: 0
                    })
                }
            } else if (type === 'childCatalog') {
                const childs = await ChildCatalog.find().populate('parent', 'name');
                for (const child of childs) {
                    overview.push({
                        _id: child._id,
                        parent: child.parent.name,
                        name: child.title,
                        turnovers: 0
                    })
                    // console.log('child: ', child._id);
                }
            }
            // console.log(overview);
            const orders = await Order.find({ status: 1, shippingStatus: 1, createdAt: { $gte: startDate, $lte: moment(endDate).endOf('day').toDate() } });
            for (const order of orders) {
                const items = order.cart.items;
                for (const item of items) {
                    // const { product: productId, quantity } = item;
                    const productId = item.id;
                    const quantity = item.amount;
                    try {
                        // const query = [{ path: 'parentCatalog', select: 'name' }, { path: 'childCatalog', select: 'title' }];

                        const product = await Product.findById(productId);
                        // console.log(product);

                        let id;
                        if (type === 'catalog') {
                            id = product.parentCatalog;

                        } else if (type === 'childCatalog') {
                            id = product.childCatalog;
                        }
                        const index = overview.findIndex(c => {
                            return (c._id.toString() === id.toString())
                        });
                        overview[index].turnovers += product.price * quantity;

                    } catch (error) {
                        continue;
                    }
                }

            }
            // console.log(overview);
            setCache(`getOverview/${type}-${startDate}-${endDate}`, overview);
            res.status(200).json({ overview: overview });
        }
    } catch (error) {
        next(errorHandler.throwErr('Something wrong with order!', 401));
    }
}
admin.getHistory = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const Cache = await getCache(`getHistory`);
    if (Cache !== null) {
        res.status(200).json({ history: JSON.parse(Cache) });
    } else {

        const history = [];
        const year = moment().format('YYYY');

        for (let i = 1; i <= 12; i++) {
            history.push({ month: i, turnovers: 0 });
            // history[i].month = i;
            let startDate;
            let endDate;
            if (i >= 10) {
                startDate = moment(`${year}-${i}`).startOf('month');
                endDate = moment(`${year}-${i}`).endOf('month');
            } else {
                startDate = moment(`${year}-0${i}`).startOf('month');
                endDate = moment(`${year}-0${i}`).endOf('month');
            }
            // console.log(startDate, '-', endDate);
            try {
                const orders = await Order.find({ status: 1, shippingStatus: 1, createdAt: { $gte: startDate, $lte: moment(endDate).endOf('day') } });
                for (const order of orders) {
                    history[i - 1].turnovers += order.total;
                }

            } catch (error) {
                return next(errorHandler.throwErr('Something wrong with order!', 401));
            }
        }
        setCache(`getHistory`, history);
        res.status(200).json({ history: history });
    }
}
// voucher
admin.postVoucher = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(errorHandler.throwErr(errors.errors[0].msg, 422));
    }
    const { captcha, percent, vnd, fromDate, toDate } = req.body;
    // console.log(fromDate);
    // console.log(toDate);
    try {
        const existVoucher = await Voucher.find({ captcha: captcha });
        if (existVoucher.length > 0) {
            throw errorHandler.throwErr('Captcha is existed.', 409);
        }
        const voucher = new Voucher({
            captcha,
            percent,
            vnd,
            fromDate,
            toDate,
        });
        const result = await voucher.save();
        delCache('getVouchers');
        pushNotification('all',
            'Dành tặng cho khách hàng ghé thăm NVD Shop',
            `Mã giảm giá (${percent !== 0 ? percent : vnd}${percent !== 0 ? '%' : 'VND'}): ${result.captcha}`,
            'voucher'
        )
        res.status(201).json({ voucher: result });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
admin.getVouchers = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    try {
        const Cache = await getCache(`getVouchers`);
        if (Cache !== null) {
            res.status(200).json({ vouchers: JSON.parse(Cache) });
        } else {
            const vouchers = await Voucher.find();
            setCache(`getVouchers`, vouchers);
            res.status(200).json({ vouchers: vouchers });
        }
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
admin.deleteVoucher = async (req, res, next) => {
    if (req.accessTokenPayload.role === 0) {
        return next(errorHandler.throwErr('Do not have permission!', 401));
    }
    const voucherId = req.params.voucherId;
    try {
        await Voucher.findByIdAndDelete(voucherId);
        delCache('getVouchers');
        res.status(200).json({ mess: 'Voucher is deleted.' });
    } catch (error) {
        next(errorHandler.defaultErr(error));
    }
}
export default admin;