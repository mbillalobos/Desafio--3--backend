const express = require("express");
const app = express();
const PUERTO = 8080;

const ProductManager = require("../src/controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");

app.get("/", (req, res) => {
    res.send("Desafío número 2");
});

app.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.log("Error al obtener los productos.", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

app.get("/products/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        const product = await productManager.getProductById(parseInt(id));

        if (!product) {
            res.json({ error: "Producto no encontrado" });
        } else {
            res.json(product);
        }

    } catch (error) {
        console.log("Error al obtener el producto.", error);
        res.status(500).json({ error: "Error del servidor" });
    }
})

app.listen(PUERTO);