import mongoose from "mongoose";

const Schema = mongoose.Schema;

const catalogSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    value: {
        type: String
    },
    ChildCatalogs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ChildCatalog',
            default: []
        }
    ],
    featuredProducts: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        default: [],
    }
    ],
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

const model = mongoose.model('Catalog', catalogSchema);

export default model;