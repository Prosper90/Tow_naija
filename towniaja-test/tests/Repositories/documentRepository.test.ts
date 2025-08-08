import { beforeAll, afterAll, afterEach, describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { DocumentI, DriverI, VehicleI } from "../../utils/interface";
import DocumentRepository from "../../repositories/documentRepository";
import DriverRepository from "../../repositories/driverRepository";
import VehicleRepository from "../../repositories/vehicleRepository";

describe("DocumentRepository", () => {
  let mongoServer: MongoMemoryServer;
  let driverRepository: DriverRepository;
  let vehicleRepository: VehicleRepository;
  let documentRepository: DocumentRepository;

  beforeAll(async () => {
    //MongoMemoryServer and connect
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    
    //initialize Driver repository
    driverRepository = new DriverRepository();
    //initialize Vehicle repository
    vehicleRepository = new VehicleRepository();
    //initialize Document repository
    documentRepository = new DocumentRepository();
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
  it("should be able to create a new Document document", async () => {
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

    //create vehicle
    const driverVehicleData: Partial<VehicleI> = {
        driverId: createADriver._id,
        typeOf: "FlatBed",
        plateNumber: "PlateNumber",
    };
    const vehicleData = await vehicleRepository.create(driverVehicleData);
    //create document
    const driverDocumentData: Partial<DocumentI> = {
    driverId: createADriver._id,
    vehicleId: vehicleData._id,
    driverLiscense: 'dl',
    vehicleRegistration: 'vR',
    Insurance: 'Insurance',
    RoadWorthinessCertificate: 'RWC',
    PermitForTowingService: 'PTS',
    CAC: 'CAC',
    isApproved: true,
    };
    const newDriver = await documentRepository.create(driverDocumentData);

    //Validate the created document
    expect(newDriver).toBeTruthy();
    expect(newDriver?.driverId).toBe(createADriver._id);
    expect(newDriver?.driverLiscense).toBe("dl");
  });

  it("should find a document by id", async () => {
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
    //create vehicle
    const driverVehicleData: Partial<VehicleI> = {
        driverId: createADriver._id,
        typeOf: "FlatBed",
        plateNumber: "PlateNumber",
    };
    const vehicleData = await vehicleRepository.create(driverVehicleData);

    //create document
    const driverDocumentData: Partial<DocumentI> = {
        driverId: createADriver._id,
        vehicleId: vehicleData._id,
        driverLiscense: 'dl',
        vehicleRegistration: 'vR',
        Insurance: 'Insurance',
        RoadWorthinessCertificate: 'RWC',
      // password: "kkslsl",
    };
    //first create a new data
    const createdDriver: Partial<DocumentI> = await documentRepository.create(
        driverDocumentData
    );
    //pass the created driver id to the find by id
    const foundDriver = await documentRepository.findById(
      createdDriver?._id as string
    );

    //validate the result
    expect(foundDriver).toBeTruthy();
    expect(foundDriver.driverId).eql(createADriver._id);
  });

  it("should find a driver document by field", async () => {
    //create a driver
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
    //create vehicle
    const driverVehicleData: Partial<VehicleI> = {
        driverId: createADriver._id,
        typeOf: "FlatBed",
        plateNumber: "PlateNumber",
    };
    const vehicleData = await vehicleRepository.create(driverVehicleData);
    //document data
    const driverDocumentData: Partial<DocumentI> = {
        driverId: createADriver._id,
        vehicleId: vehicleData._id,
        driverLiscense: 'dl',
        vehicleRegistration: 'vR',
        Insurance: 'Insurance',
        RoadWorthinessCertificate: 'RWC',
      // password: "password123",
    };
    //first create a new data
    const createdDriverDocument: Partial<DocumentI> = await documentRepository.create(
        driverDocumentData
    );

    //now find the driver by field
    const foundDriverDocument = await documentRepository.findOneByField({
        vehicleId: vehicleData._id,
    });

    //validateResult
    expect(foundDriverDocument).toBeTruthy();
    expect(foundDriverDocument?.vehicleId).eql(vehicleData._id);
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
    //create vehicle
    const driverVehicleData: Partial<VehicleI> = {
        driverId: createADriver._id,
        typeOf: "FlatBed",
        plateNumber: "PlateNumber",
    };
    const vehicleData = await vehicleRepository.create(driverVehicleData);
    //create document
    const driverDataDocument: Partial<DocumentI> = {
        driverId: createADriver._id,
        vehicleId: vehicleData._id,
        driverLiscense: 'dl',
        vehicleRegistration: 'vR',
        Insurance: 'Insurance',
        RoadWorthinessCertificate: 'RWC',
    };
    //first create a new data
    const createdDriverDocument: Partial<DocumentI> = await documentRepository.create(
        driverDataDocument
    );

    //now find the driver by field
    const editedDriverDocument = await documentRepository.update(
      "_id",
      createdDriverDocument._id,
      { vehicleId: vehicleData._id }
    );

    //validateResult
    expect(editedDriverDocument).toBeTruthy();
    expect(editedDriverDocument?.vehicleId).eql(vehicleData._id);
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
    //create vehicle
    const driverVehicleData: Partial<VehicleI> = {
        driverId: createADriver._id,
        typeOf: "FlatBed",
        plateNumber: "PlateNumber",
    };
    const vehicleData = await vehicleRepository.create(driverVehicleData);
    //create document
    const driverDataDocument: Partial<DocumentI> = {
        driverId: createADriver._id,
        vehicleId: vehicleData._id,
        driverLiscense: 'dl',
        vehicleRegistration: 'vR',
        Insurance: 'Insurance',
        RoadWorthinessCertificate: 'RWC',
    };
    //first create a new data
    const createdDriverDocument: Partial<DocumentI> = await documentRepository.create(
        driverDataDocument
    );

    //now delete the driver
    const deletedDriverDocument = await documentRepository.remove(
      "_id",
      createdDriverDocument._id
    );
    const findDeleted = await documentRepository.findById(createdDriverDocument._id as string)
    //validateResult
    expect(deletedDriverDocument).toBeTruthy();
    expect(findDeleted?.vehicleId).toBe(undefined);
    expect(findDeleted).toBeNull();
  });
});
