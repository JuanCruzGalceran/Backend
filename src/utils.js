import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Handlebars from "handlebars";
import crypto from "crypto";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

Handlebars.registerHelper("subtotal", function (price, quantity) {
  return price * quantity;
});

Handlebars.registerHelper("sum", function (values) {
  return values.reduce((acc, val) => acc + val, 0);
});

Handlebars.registerHelper('eq', function (v1, v2) {
  return v1 === v2;
});

export const routes = {
  products: join(__dirname, "data", "productos.json"),
  carts: join(__dirname, "data", "carts.json"),
};

const SECRET = "CoderCoder123";

export const creaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword = (usuario, password) => bcrypt.compareSync(password, usuario.password);
