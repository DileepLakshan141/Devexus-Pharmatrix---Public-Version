const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const ClientModel = require("../models/client.model");

describe("Client Authentication Routes", () => {
  jest.setTimeout(30000);

  let mongoServer;

  const testUser = {
    username: "testuser",
    email: "test@example.com",
    telephone: "0771234567",
    password: "password123",
    role: 5321,
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await ClientModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should create a new client account", async () => {
    const res = await request(app)
      .post("/pharmatrix-api/clients/signup")
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user_id");
    expect(res.body).toHaveProperty("email", testUser.email);
  });

  it("should reject duplicate email registration", async () => {
    await request(app).post("/pharmatrix-api/clients/signup").send(testUser);
    const res = await request(app)
      .post("/pharmatrix-api/clients/signup")
      .send(testUser);
    expect(res.statusCode).toBe(400);
  });

  // it("should login the client with correct credentials", async () => {
  //   await request(app).post("/pharmatrix-api/clients/signup").send(testUser);
  //   const res = await request(app).post("/pharmatrix-api/clients/auth").send({
  //     email: testUser.email,
  //     password: testUser.password,
  //   });
  //   expect(res.statusCode).toBe(202);
  //   expect(res.body).toHaveProperty("access_token");
  //   expect(res.body).toHaveProperty("username", testUser.username);
  // });

  it("should reject login with wrong password", async () => {
    await request(app).post("/pharmatrix-api/clients/signup").send(testUser);
    const res = await request(app).post("/pharmatrix-api/clients/auth").send({
      email: testUser.email,
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "invalid username or password");
  });
});
