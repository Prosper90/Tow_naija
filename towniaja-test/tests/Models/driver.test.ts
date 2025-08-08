import mongoose from "mongoose";
import Driver from "../../models/Driver";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Driver Model", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should set and get balance correctly", async () => {
    // Create a driver with balance of 15
    const driver = await Driver.create({ name: "Test Driver", balance: 15 });
    // The raw value in database should be 1500 (15 * 100)
    expect(driver.balance).toBe(15);  // Getter converts 1500 to 15
    expect(driver.get('balance', null, { getters: false })).toBe(1500);  // Raw value
    
  // Update balance to 20
  driver.balance = 20;  // Setter will convert this to 2000
  await driver.save();
  
  const updatedDriver = await Driver.findById(driver._id);
  expect(updatedDriver?.balance).toBe(20);  // Getter converts 2000 to 20
  expect(updatedDriver?.get('balance', null, { getters: false })).toBe(2000);  // Raw value
  });
});
