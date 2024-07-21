import { expect } from "chai";
import { describe, it } from "mocha";
import supertestSession from "supertest-session";

const requester = supertestSession("http://localhost:3001");

describe("Carts API", () => {
  it("Deberia traer todos los carritos", done => {
    requester
      .get("/api/carts")
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("carts");
        done();
      });
  });

  it("Deberia crear un nuevo carrito", done => {
    requester
      .post("/api/carts")
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id");
        done();
      });
  });

  it("Deberia traer un carrito por su ID", done => {
    const cartId = "6644e871fe1a439fc8580348";
    requester
      .get(`/api/carts/${cartId}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("cart");
        done();
      });
  });
});

describe("Products API", () => {
  it("Deberia traer todos los productos", done => {
    requester
      .get("/api/products")
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("payload");
        done();
      });
  });

  it("Deberia traer un producto por su ID", done => {
    const productId = "65f5fe62fdbf6fdcd406a643";
    requester
      .get(`/api/products/${productId}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("product");
        done();
      });
  });

  it("Deberia crear un nuevo producto", done => {
    const product = {
      title: "Nuevo Producto",
      description: "Esta es una descripción del nuevo producto",
      price: 100,
      stock: 50,
      thumbnail: "http://example.com/thumbnail.jpg",
      code: "NP123",
      category: "General",
      status: true,
      owner: "admin",
      email: "admincoder@coder.com",
    };
    requester
      .post("/api/products")
      .send(product)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        if (res.body.error) {
          done(new Error(res.body.error.message));
        } else {
          expect(res.body).to.have.property("message").eql("Producto creado correctamente");
          done();
        }
      });
  });
});

describe("Sessions API", () => {
  it("Deberia registrar un nuevo usuario", done => {
    const user = {
      username: "testuser",
      first__name: "Test",
      last__name: "User",
      age: 30,
      email: "test@example.com",
      password: "password123",
      rol: "user",
    };
    requester
      .post("/api/sessions/register")
      .send(user)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });

  it("Deberia loguear a un usuario", done => {
    const user = {
      email: "test@example.com",
      password: "password123",
    };
    requester
      .post("/api/sessions/login")
      .send(user)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message").eql("Login correcto");
        done();
      });
  });

  it("Deberia traer el usuario actual", done => {
    requester
      .get("/api/sessions/current")
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an("object");
        done();
      });
  });
});
