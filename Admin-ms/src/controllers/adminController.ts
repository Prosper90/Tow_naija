import { NextFunction, Request, Response } from "express";
import AdminService from "../services/adminService";
import AdminRepository from "../repositories/adminRepository";
import bcrypt from "bcrypt";


AdminService.setRepository(new AdminRepository());


class AuthController {


  //rider

  static CreateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const {email, password} = req.body; 


        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const data = {
          email: email,
          password: hashedPassword,
          role: "admin"
        }
        const driver = await AdminService.createAdmin(data);

        res
        .status(200)
        .json({ 
          status: true, 
           data: driver
        });
    } catch (error) {
        next(error);
    }
  }


  static getAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      
      const admins = await AdminService.getAll();

      res
        .status(200)
        .json({ 
          status: true, 
           data: admins
        });

    } catch (error) {
      next(error);
    } 
  };


  static getAnAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { adminId } = req.params;

      const admin = await AdminService.getOne(adminId);

      res.status(200).json({ status: true, data: admin });
    } catch (error) {
      next(error);
    }
  };


  static updateAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { dataToUpdate, adminId } = req.body;

      const updatedDriver = await AdminService.updateAdmin(adminId, dataToUpdate);

      res.status(200).json({ status: true, data: updatedDriver });
    } catch (error) {
      next(error);
    }
  };

  static DeleteAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { adminId } = req.body;

      await AdminService.deleteAdmin(adminId as string);
      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      next(error);
    }
  };




}

export default AuthController;
