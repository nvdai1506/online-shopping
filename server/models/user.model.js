import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    phone: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },

    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    rfToken: {
        type: String,
        default: ''
    },
    points: {
        type: Number,
        default: 0
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                amount: {
                    type: Number,
                    required: true
                },
                currentSize: {
                    type: String,
                    required: true
                },
            }
        ],
        totalPrice: {
            type: Number,
            default: 0
        },
        totalAmount: {
            type: Number,
            default: 0
        },
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order',
        default: []
    }]
});

userSchema.methods.updateCart = async function (cart) {
    this.cart = cart;
    return this.save();
}
userSchema.methods.addToCart = async function (product) {
    const indexOfProduct = this.cart.items.findIndex(item => {
        return item.product.toString() === product._id.toString();
    })
    const updatedCart = this.cart;
    let newAmount = 1;
    if (indexOfProduct >= 0) {
        newAmount = this.cart.items[indexOfProduct].amount + 1;
        updatedCart.items[indexOfProduct].amount = newAmount;
        updatedCart.totalPrice += product.price;
    } else {
        const item = {
            product: product._id,
            amount: newAmount
        }
        updatedCart.items.push(item);
        updatedCart.totalPrice += product.price;
        updatedCart.totalAmount += 1;
    }
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function (product) {
    const indexOfProduct = this.cart.items.findIndex(item => {
        return item.product.toString() === product._id.toString();
    })
    let updatedCart = this.cart;
    let amount = updatedCart.items[indexOfProduct].amount;
    if (amount > 1) {
        updatedCart.items[indexOfProduct].amount = amount - 1;
    } else {
        updatedCart.items = updatedCart.items.filter(item => {
            return item.product.toString() !== product._id.toString();
        });
    }
    updatedCart.totalPrice -= product.price;
    updatedCart.totalAmount -= 1;
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart.items = [];
    this.cart.totalPrice = 0;
    this.cart.totalAmount = 0;
    return this.save();
};

const model = mongoose.model('User', userSchema);

export default model;