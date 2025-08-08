import { NextFunction, Request, Response } from "express";
import TransactionService from "../services/transactionService";
import TransactionRepository from "../repositories/transactionRepository";
import { TransactionI } from "../utils/interface";


TransactionService.setRepository(new TransactionRepository());

class TransactionController {




  static getTxs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<TransactionI[] | any> => {
    try {
  
     const txs = await TransactionService.getTxs(req.user._id);
      res.status(200).json({ status: true, balance: req.user.balance, data: txs });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  static getParticularTX = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<TransactionI | any> => {
    try {
      const { id } = req.params;
      const getOne = await TransactionService.getOneTx(id);
      res.status(200).json({ status: true, data: getOne });
    } catch (error) {
      next(error);
    }
  };

  
}

export default TransactionController;
