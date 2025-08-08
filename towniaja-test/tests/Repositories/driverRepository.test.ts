import { beforeAll, afterAll, afterEach, describe, it, expect } from "vitest";
import DriverRepository from "../../repositories/driverRepository";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { DriverI } from "../../utils/interface";

describe("DriverRepository", () => {
  let mongoServer: MongoMemoryServer;
  let driverRepository: DriverRepository;

  beforeAll(async () => {
    //MongoMemoryServer and connect
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    //initialize Driver repository
    driverRepository = new DriverRepository();
  });

  afterAll(async () => {
    //Stop MongoMemory and disconnect mongoose
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    //Clean up database between test
    await mongoose.connection.db.dropDatabase;
  });

  //begin testing
  it("should be able to create a new driver document", async () => {
    const driverData: Partial<DriverI> = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      balance: 5000,
      isVerified: true,
      isOnline: false,
      // password: "password123",
      state: "CA",
      lga: "Los Angeles",
      avatar: "avatar_url",
    };
    const newDriver = await driverRepository.create(driverData);

    //Validate the created document
    expect(newDriver).toBeTruthy();
    expect(newDriver?.firstName).toBe("John");
    expect(newDriver?.email).toBe("johndoe@example.com");
  });

  it("should find a driver by ID", async () => {
    const driverData: Partial<DriverI> = {
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@example.com",
      // password: "kkslsl",
    };
    //first create a new data
    const createdDriver: Partial<DriverI> = await driverRepository.create(
      driverData
    );
    //pass the created driver id to the find by id
    const foundDriver = await driverRepository.findById(
      createdDriver?._id as string
    );

    //validate the result
    expect(foundDriver).toBeTruthy();
    expect(foundDriver?.firstName).toBe("Jane");
  });

  it("should find a driver by field", async () => {
    const driverData: Partial<DriverI> = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      balance: 5000,
      isVerified: true,
      isOnline: false,
      // password: "password123",
    };
    //first create a new data
    const createdDriver: Partial<DriverI> = await driverRepository.create(
      driverData
    );

    //now find the driver by field
    const foundDriver = await driverRepository.findOneByField({
      phone: "1234567890",
    });

    //validateResult
    expect(foundDriver).toBeTruthy();
    expect(foundDriver?.firstName).toBe("John");
  });

  it("should update a driver data", async () => {
    const driverData: Partial<DriverI> = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      balance: 5000,
      isVerified: true,
      isOnline: false,
      // password: "password123",
    };
    //first create a new data
    const createdDriver: Partial<DriverI> = await driverRepository.create(
      driverData
    );

    //now find the driver by field
    const editedDriver = await driverRepository.update(
      "_id",
      createdDriver._id,
      { firstName: "Alice" }
    );

    //validateResult
    expect(editedDriver).toBeTruthy();
    expect(editedDriver?.firstName).toBe("Alice");
  });

  it("should delete a driver data", async () => {
    const driverData: Partial<DriverI> = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      balance: 5000,
      isVerified: true,
      isOnline: false,
      // password: "password123",
    };
    //first create a new data
    const createdDriver: Partial<DriverI> = await driverRepository.create(
      driverData
    );

    //now delete the driver
    const deletedDriver = await driverRepository.remove(
      "_id",
      createdDriver._id
    );
    const findDeleted = await driverRepository.findById(createdDriver._id as string)
    //validateResult
    expect(deletedDriver).toBeTruthy();
    expect(findDeleted?.firstName).toBe(undefined);
    expect(findDeleted).toBeNull();
  });
});
