import { Document, FilterQuery, Model } from "mongoose";

class BaseRepository<T extends Document> {
  model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async findOneByField(field: {
    [key: string]: any;
  }): Promise<T | null> {
    try {
      return this.model.findOne(field as FilterQuery<T>);
    } catch (error) {
      throw error;
    }
  }

  public async findMultipleByField(
    field: string,
    Seearchvalue: any
  ): Promise<T[] | null> {
    try {
      return this.model
        .find({ [field]: Seearchvalue } as FilterQuery<T>)
        .exec();
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: string): Promise<T | null> {
    try {
      return this.model.findById(id).exec();
    } catch (error) {
      throw error;
    }
  }

  public async update(
    fieldToSearchBy: string,
    fieldValue: any,
    options: Partial<T>,
    unsetfields?: string[]
  ): Promise<T> {
    try {
      const updateObj: any = { $set: options };

      if (unsetfields) {
        updateObj.$unset = Object.fromEntries(
          unsetfields.map((field) => [field, ""])
        );
      }

      return this.model.findOneAndUpdate(
        { [fieldToSearchBy]: fieldValue } as FilterQuery<T>,
        updateObj,
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }


  public async unSetFields(
    fieldToSearchBy: string,
    fieldValue: any,
    unsetfields?: string[]
  ): Promise<T> {
    try {

      // Ensure unsetfields exists and is an array
      if (!unsetfields || unsetfields.length === 0) {
        throw new Error("No fields specified to unset.");
      }


      const updateObj: any = {
        $unset: Object.fromEntries(unsetfields.map((field) => [field, ""])),
      };

      return this.model.findOneAndUpdate(
        { [fieldToSearchBy]: fieldValue } as FilterQuery<T>, 
        updateObj, 
        { new: true }
      );

    } catch (error) {
      throw error;
    }
  }

  public async remove(
    fieldValueSearchBy: string,
    field: any
  ): Promise<T | null> {
    try {
    // Ensure the fieldValueSearchBy is used correctly as a key
    const query: FilterQuery<T> = { [fieldValueSearchBy]: field } as FilterQuery<T>;

    // Execute findOneAndDelete with the constructed query
    return await this.model.findOneAndDelete(query);
    } catch (error) {
      throw error;
    }
  }


  public async increment(
    id: string,
    amount: number
  ): Promise<T | null> {
    try {
      return this.model.findOneAndUpdate({_id: id}, {
        $inc: {balance: amount}
      })
    } catch (error) {
      throw error;
    }
  }


  public async decrement(
    id: string,
    amount: number
  ): Promise<T | null> {
    try {
      return this.model.findOneAndUpdate({_id: id}, {
        $inc: {balance: -amount}
      })
    } catch (error) {
      throw error;
    }
  }

  public async create(options: Partial<T>): Promise<T | null> {
    try {
      return this.model.create(options);
    } catch (error) {
      throw error;
    }
  }
}

export default BaseRepository;
