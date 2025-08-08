import Transaction from "../models/Transactions";
import {TransactionI } from "../utils/interface";
import BaseRepository from "./baseRepository";

class TransactionRepository extends BaseRepository<TransactionI> {
  constructor() {
    super(Transaction);
  }
}

export default TransactionRepository;
