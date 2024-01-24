//Se importa FileSystem (fs).

const fs = require("fs").promises;

//Se crea la clase ProductManager.

class ProductManager {

    //Constructor con elemento products el cual es un arreglo vacío.
    constructor(path){
        this.products = [];
        this.path = path;
    }

    //Propiedad estática para poder crear un ID autoincrementable.
    static lastId = 0;

    //Metodo addProduct para agregar productos al arreglo inicial.
    async addProduct({title, description, price, thumbnail, code, stock}){

        //Validación para que todos los campos sean obligatorios.
        if(!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos tienen que estar completos para crear el producto.");
            return; 
        }

        //Validación para que no se repita el campo "code".
        if(this.products.some(producto => producto.code === code)){
            console.log("El código de producto indicado ya está registrado.");
            return;
        }

        //Se crea el objeto.
        const newProduct = {
            id: ++ProductManager.lastId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        }

        //Se pushea el objeto para agregar las propiedades del producto al arreglo de productos inicial.
        this.products.push(newProduct);

        //Guardar el array de productos en el archivo.
        await this.saveArchive(this.products);

    }

    //Metodo getProducts para devolver el arreglo con todos los productos creados hasta el momento.
    async getProducts(){
        await this.readArchive();
    }

    //Metodo getProductById para buscar en el arreglo el producto que coincida con el ID.
    async getProductById(id){
        try {
            const arrayProducts = await this.readArchive();
            const searchProduct = arrayProducts.find(item => item.id === id);
            if(searchProduct){
                console.log(searchProduct);
            } else {
                console.log("El producto con el ID solicitado no existe");
            }
        } catch (error) {
            console.log("Error al obtener el producto", error);
        }
    }

    //Metodo updateProduct para buscar un producto con su ID y poder actualizar uno o todos los cámpos del producto.

    async updateProduct(id, newProduct) {
        try {
            const products = await fs.readFile(this.path, "utf-8");
            const arrayProducts = await (JSON.parse(products))
            const index = arrayProducts.findIndex(producto => producto.id === id);
        
            if (index !== -1) {
                newProduct.id = id;
                products[index] = newProduct;
        
                await this.saveArchive(products);
        
                console.log('Producto actualizado con éxito.');

            } else {
                console.log('Producto no encontrado.');
            }
            } catch (error) {
            console.error('Error al actualizar el producto:', error);
            }
      }

    //Metodo deleteProduct para buscar un producto con su ID y poder eliminarlo.
    async deleteProduct(id) {
        try {
            const products = await fs.readFile(this.path, "utf-8");
            const arrayProducts = await (JSON.parse(products))
            const newProducts = await arrayProducts.filter(product => product.id !== id);
            await this.saveArchive(newProducts);
            console.log('Producto eliminado con éxito.');
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }

    //Metodo readArchive para leer el archivo y parsearlo para retornarlo como un array.
    async readArchive(){
        try {
            const response = await fs.readFile(this.path, "utf-8");
            const arrayProducts = await (JSON.parse(response));
            console.log(arrayProducts);
        } catch (error) {
            console.log("Error al leer el archivo ", error);
        }
    }

    //Metodo saveArchive par convertir en json el array y guardarlo en el archivo.
    async saveArchive(arrayProducts){
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo ", error);
        }
    }

}

module.exports = ProductManager;


