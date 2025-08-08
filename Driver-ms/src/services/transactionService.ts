import { TransactionI, VehicleI } from "../utils/interface";
import TransactionRepository from "../repositories/transactionRepository";
import ErrorResponse from "../utils/errorResponse";

// const transactionRepository = new transactionRepository();

class TransactionService {
  private static transactionRepository: TransactionRepository;


  static setRepository(repo: TransactionRepository) {
    this.transactionRepository = repo;
  }

  /**
   *
   * @param id
   * @returns
   */
  static getTxs = async (id: string): Promise<TransactionI []> => {
    try {
      //find the documents by id
      const foundTxs = await this.transactionRepository.findMultipleByField("driverId", id);

      return foundTxs;
    } catch (error) {
      throw error;
    }
  };

   static getOneTx = async (id: string): Promise<TransactionI> => {
    try {
      //find the documents by id
      const foundTx = await this.transactionRepository.findById(id);

      if (!foundTx) {
        throw new ErrorResponse("Tx not found", 401);
      }

      return foundTx;
    } catch (error) {
      throw error;
    }
  };

  
}

export default TransactionService;
