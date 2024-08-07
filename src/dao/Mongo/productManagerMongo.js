import { productsModel } from "../models/products.model.js";

export default class ProductManager {

    getProducts = async () => {
        try {
            return await productsModel.find().lean();
        } catch (err) {
            return err
        }
    }

    getProductsFiltered = async (category = null) => {
        try {
            let filter = {}; 
            if (category) {
                filter.category = category;
            }
            return await productsModel.find(filter).lean();
        } catch (err) {
            return err;
        }
    }

    getProductById = async (id) => {
        try {
            return await productsModel.findById(id)

        } catch (err) {
            return { error: err.message }
        }
    }

    addProduct = async (product) => {
        try {
            console.log("debugJ Mongo", product);
            await productsModel.create(product);
            return await productsModel.findOne({ title: product.title })
        }
        catch (err) {
            return err
        }

    }

    updateProduct = async (id, product) => {
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product });
        } catch (err) {
            return err
        }

    }

    deleteProduct = async (id) => {
        try {
            return await productsModel.findByIdAndDelete(id);
        } catch (err) {
            return err
        }

    }

}