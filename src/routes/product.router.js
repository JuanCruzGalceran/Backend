import express from 'express';
import { routes } from '../utils.js';
import ProductManager from '../dao/controllers/Mongo/productManagerMongo.js';
import { productsModel } from '../dao/models/products.model.js';

const router = express.Router();

const rutaProductos = routes.products;
const products = new ProductManager(rutaProductos);

router.get("/", async (req, res) => {
    let { pagina, limit, query, sort } = req.query;

    if (!pagina) {
        pagina = 1;
    }

    if (!limit) {
        limit = 6;
    }

    let filter = {};
    if (query && query !== "") {
        filter = { category: query };
    }

    switch (sort) {
        case "asc":
            sort = { "price": 1 };
            break;
        case "desc":
            sort = { "price": -1 };
            break;
        default:
            sort = undefined;
            break;
    }

    try {
        let {
            docs: listadeproductos,
            totalPages,
            prevPage, nextPage,
            page,
            hasPrevPage, hasNextPage } = await productsModel.paginate(filter, { limit: limit, page: pagina, sort: sort, lean: true });

        res.status(200).json({
            status: "success",
            payload: listadeproductos,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: page > 1 ? `/?page=${page - 1}` : null,
            nextLink: page < totalPages ? `/?page=${page + 1}` : null
        })

    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/:pid", async (req, res) => {
    try {
        let productId = req.params.pid;
        let product = await products.getProductById(productId);
        res.json({ product });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        await products.addProduct(newProduct);
        res.status(201).json({ message: "Producto creado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProduct = req.body;
        await products.updateProduct(productId, updatedProduct);
        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid;
        await products.deleteProduct(productId);
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;