import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

Handlebars.registerHelper('subtotal', function(price, quantity) {
    return price * quantity;
});

Handlebars.registerHelper('sum', function(values) {
    return values.reduce((acc, val) => acc + val, 0);
});

export const routes = {
    products: join(__dirname, 'data', 'productos.json'),
    carts: join(__dirname, 'data', 'carts.json'),
};

