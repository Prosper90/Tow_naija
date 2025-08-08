import Driver from './Driver';
import Document from './Documents';
import Vehicle from './Vehicle';
import mongoose from 'mongoose';

export function setupModelRelationships() {
  // Get the schema from the registered model
  const driverSchema = (Driver as any).schema;
  
  // Add virtual fields after all models are registered
  driverSchema.virtual("documents", {
    ref: "Document",
    localField: "_id",
    foreignField: "driverId",
  });
  
  driverSchema.virtual("vehicle", {
    ref: "Vehicle",
    localField: "_id",
    foreignField: "driverId",
  });
  
  // Return all models to confirm they're properly set up
  return {
    Driver,
    Document,
    Vehicle
  };
}