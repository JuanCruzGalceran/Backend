import { fileURLToPath } from "url";
import { dirname, join } from "path";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// export const routes = {
//   products: join(__dirname, "data", "productos.json"),
//   carts: join(__dirname, "data", "carts.json"),
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, __dirname, "src/public/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
