import { beforeAll, afterAll, afterEach, describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { DocumentI, DriverI, VehicleI } from "../../utils/interface";
import VehicleRepository from "../../repositories/vehicleRepository";
import DriverRepository from "../../repositories/driverRepository";

describe("VehicleRepository", () => {
  let mongoServer: MongoMemoryServer;
  let driverRepository: DriverRepository;
  let vehicleRepository: VehicleRepository;

  beforeAll(async () => {
    //MongoMemoryServer and connect
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    //initialize Vehicle repository
    driverRepository = new DriverRepository()
    //initialize Driver repository
    vehicleRepository = new VehicleRepository();
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
  it("should be able to create a new Vehicle document", async () => {
    //create driver
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
    const createADriver = await driverRepository.create(driverData);

    const driverVehicleData: Partial<VehicleI> = {
        driverId: createADriver._id,
        typeOf: "FlatBed",
        plateNumber: "PlateNumber",
    };
    const newDriverVehicle = await vehicleRepository.create(driverVehicleData);

    //Validate the created document
    expect(newDriverVehicle).toBeTruthy();
    expect(newDriverVehicle?.plateNumber).toBe("PlateNumber");
    expect(newDriverVehicle?.typeOf).toBe("FlatBed");
  });

  it("should find a vehicle by id", async () => {
    //create driver
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
    const createADriver = await driverRepository.create(driverData);    
    const driverDocumentData: Partial<VehicleI> = {
        driverId: createADriver._id,
        typeOf: "FlatBed",
        plateNumber: "PlateNumber",
    };
    //first create a new data
    const createdDriverVehicle: Partial<VehicleI> = await vehicleRepository.create(
        driverDocumentData
    );
    //pass the created driver id to the find by id
    const foundDriver = await vehicleRepository.findById(
      createdDriverVehicle?._id as string
    );

    //validate the result
    expect(foundDriver).toBeTruthy();
    expect(foundDriver?.driverId).eql(createADriver._id);
  });

  it("should find a driver vehicle by field", async () => {
    //create driver
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
    const createADriver = await driverRepository.create(driverData);    
    const driverVehicleData: Partial<VehicleI> = {
        driverId: createADriver._id,
        typeOf: "FlatBed",
        plateNumber: "PlateNumber",
    };
    //first create a new data
    const createdDriverVehicle: Partial<VehicleI> = await vehicleRepository.create(
      driverVehicleData
    );

    //now find the driver by field
    const foundDriverVehicle = await vehicleRepository.findOneByField({
        driverId: createADriver._id,
    });

    //validateResult
    expect(foundDriverVehicle).toBeTruthy();
    expect(foundDriverVehicle?.typeOf).toBe("FlatBed");
  });

  it("should update a driver Document data", async () => {
    //create driver
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
    const createADriver = await driverRepository.create(driverData);    
    const driverDataDocument: Partial<VehicleI> = {
        driverId: createADriver._id,
        typeOf: "FlatBed",
        plateNumber: "PlateNumber",
    };
    //first create a new data
    const createdDriverVehicle: Partial<VehicleI> = await vehicleRepository.create(
        driverDataDocument
    );

    //now find the driver by field
    const editedDriverVehicle = await vehicleRepository.update(
      "_id",
      createdDriverVehicle._id,
      { typeOf: "FlatBed" }
    );

    //validateResult
    expect(editedDriverVehicle).toBeTruthy();
    expect(editedDriverVehicle?.driverId).eql(createADriver._id);
  });

  it("should delete a driver document data", async () => {
    //create driver
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
    const createADriver = await driverRepository.create(driverData);    
    const driverDataDocument: Partial<VehicleI> = {
        driverId: createADriver._id,
        typeOf: "FlatBed",
        plateNumber: "PlateNumber",
    };
    //first create a new data
    const createdDriverVehicle: Partial<VehicleI> = await vehicleRepository.create(
        driverDataDocument
    );

    //now delete the driver
    const deletedDriverDocument = await vehicleRepository.remove(
      "_id",
      createdDriverVehicle._id
    );
    const findDeleted = await vehicleRepository.findById(createdDriverVehicle._id as string)
    //validateResult
    expect(deletedDriverDocument).toBeTruthy();
    expect(findDeleted?.plateNumber).toBe(undefined);
    expect(findDeleted).toBeNull();
  });
});
