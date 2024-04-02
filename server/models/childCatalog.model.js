import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChildCatalogschema = new Schema({
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Catalog',
        require: true
    },
    title: {
        type: String,
        require: true
    },
    value: {
        type: String
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        default: []
    }],
    // salesFigures: [
    //     {
    //         numProducts: {
    //             type: Number,
    //             default: 0
    //         },
    //         turnovers: {
    //             type: Number,
    //             default: 0
    //         },
    //         date: {
    //             type: String
    //         }
    //     }
    // ]
});


const model = mongoose.model('ChildCatalog', ChildCatalogschema);

export default model;