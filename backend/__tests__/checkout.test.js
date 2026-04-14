const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { pool } = require("../config/db");

describe("checkout flow", () => {
  let authToken;
  let productId;

  beforeAll(async () => {
    require("dotenv").config();
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await pool.end();
  });

  it("registers, logs in, adds to cart, and checks out", async () => {
    const email = `user_${Date.now()}@example.com`;
    const password = "secret12";

    const reg = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email,
      password,
    });
    expect(reg.status).toBe(201);
    expect(reg.body.data.token).toBeTruthy();
    authToken = reg.body.data.token;

    const login = await request(app).post("/api/auth/login").send({
      email,
      password,
    });
    expect(login.status).toBe(200);
    authToken = login.body.data.token;

    const productRes = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test product",
        description: "Desc",
        price: 9.99,
        category: "electronics",
        stock: 5,
        images: [],
      });
    expect(productRes.status).toBe(201);
    productId = productRes.body.data._id;

    const addCart = await request(app)
      .post("/api/cart/add")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ productId, quantity: 2 });
    expect(addCart.status).toBe(200);

    const checkoutRes = await request(app)
      .post("/api/orders/checkout")
      .set("Authorization", `Bearer ${authToken}`)
      .send({});
    expect(checkoutRes.status).toBe(201);
    expect(checkoutRes.body.data.orderId).toBeTruthy();
  });
});
