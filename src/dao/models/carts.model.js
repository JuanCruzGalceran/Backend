import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2"

const { Schema, model } = mongoose;

const cartSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "products",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    }],
});

cartSchema.plugin(paginate)


cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price description category code stock thumbnail');
    next();
});

const CartModel = model("carts", cartSchema);

export default CartModel;