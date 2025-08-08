import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Document, Schema } from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import BaseRepository from "../../repositories/baseRepository";
import { afterEach } from "node:test";

//Create a Test modal interface
interface TestDoc extends Document {
  name: string;
  age: number;
}

const TestSchema = new Schema<TestDoc>({
  name: String,
  age: Number,
});

const TestModel = mongoose.model<TestDoc>("Test", TestSchema);

describe("Base Repository", () => {
  let mongoServer: MongoMemoryServer;
  let baseRepository: BaseRepository<TestDoc>;

  //handle database mock connections and disconnections
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    let uri = await mongoServer.getUri();
    await mongoose.connect(uri);

    //initiate baseRepository instance
    baseRepository = new BaseRepository<TestDoc>(TestModel);
  });

  afterAll(async () => {
    //close the connections on both mongoose and mongoServer
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    //drop the database on each test
    await mongoose.connection.dropDatabase();
  });

  it("should be able to create a document", async () => {
    //create document
    const newDoc = await baseRepository.create({ name: "alice", age: 35 });
    //evalute
    expect(newDoc).toBeTruthy();
    expect(newDoc?.name).toBe("alice");
  });

  it("should find document by id", async () => {
    //create a new document
    const newDoc = await baseRepository.create({ name: "alice", age: 35 });
    //find the document
    const findDocument = await baseRepository.findById(newDoc._id as string);
    //evaluate
    expect(findDocument).toBeTruthy();
    expect(findDocument?.name).toBe("alice");
  });

  it("should find document by field", async () => {
    //create a new document
    const newDoc = await baseRepository.create({ name: "alice", age: 35 });
    //find the document
    const findDocument = await baseRepository.findOneByField({
      _id: newDoc._id,
    });
    //evaluate
    expect(findDocument).toBeTruthy();
    expect(findDocument?.name).toBe("alice");
  });

  it("should update a document", async () => {
    //create a new document
    const newDoc = await baseRepository.create({ name: "alice", age: 35 });
    //update
    const updatedDocument = await baseRepository.update("_id", newDoc._id, {
      name: "bob",
    });

    //evaluate
    expect(updatedDocument).toBeTruthy();
    expect(updatedDocument?.name).toBe("bob");
  });

  it("should delete a document", async () => {
    //create a new document
    const newDoc = await baseRepository.create({ name: "alice", age: 35 });
    //delete the document
    const removeDocument = await baseRepository.remove("_id", newDoc._id);
    //evaluating
    expect(removeDocument).toBeTruthy();
    //find the document
    const foundDocument = await baseRepository.findById(newDoc._id as string);
    expect(foundDocument).toBe(null);
  });
});
