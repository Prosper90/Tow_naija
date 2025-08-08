import { NextFunction, Request, Response } from "express";
import AdminService from "../services/adminService";
import AdminRepository from "../repositories/adminRepository";
import bcrypt from "bcrypt";


AdminService.setRepository(new AdminRepository());


class DriverController {


  //rider
  static register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const {email, password, type} = req.body; 


      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const data = {
        email: email,
        password: hashedPassword,
        role: type || "admin"
      }
      const drivers = await AdminService.createAdmin(data);

      res
        .status(200)
        .json({ 
          status: true, 
           data: drivers
        });

    } catch (error) {
      next(error);
    } 
  };


  static login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { email, password } = req.body;

      const {findAdmin, token} = await AdminService.login(email, password);

      res.status(200).json({ status: true, data: findAdmin, token });
    } catch (error) {
      next(error);
    }
  };




}

export default DriverController;
