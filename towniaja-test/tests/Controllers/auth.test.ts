import { NextFunction, Request, Response } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import AuthController from "../../controllers/authController";
import DriverService from "../../services/driverService";
import eventService from "../../services/eventService";
import ErrorResponse from "../../utils/errorResponse";
import { DriverI } from "../../utils/interface";
import EventService from "../../services/eventService";

// Mock the services
vi.mock("../../services/driverService");
// vi.mock("../../services/eventService", () => ({
//   default: vi.fn().mockImplementation(() => ({
//     emitEvent: vi.fn().mockResolvedValue(undefined), // Mock emitEvent method
//   })),
// }));
vi.mock('../../services/eventService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      emitEvent: vi.fn(),
      listenToEvent: vi.fn(),
    })),
  };
});

describe("Auth controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: { emailornumber: "test@example.com" }, user: { _id: "mockUserId" }  };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();

    // Reset all mocks
    vi.clearAllMocks();
  });

  // afterEach(() => {
  //   vi.restoreAllMocks();
  // })

  describe("SendOtp", () => {

    it("should return an error if emailornumber is missing", async () => {
      req.body.emailornumber = undefined;
      await AuthController.SendOtp(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(
        expect.any(ErrorResponse)
      );
    });


    it("should successfully send OTP", async () => {
      //mock the services response
      const mockOtpData = { _id: "123" } as DriverI;
      vi.mocked(DriverService.checkExisting).mockResolvedValue(false);
      vi.mocked(DriverService.makeOtp).mockResolvedValue(mockOtpData);
      const eventServiceInstance = new EventService();
      vi.mocked(eventServiceInstance.emitEvent).mockResolvedValue(undefined);

      await AuthController.SendOtp(req as Request, res as Response, next);
      expect(DriverService.checkExisting).toHaveBeenCalled();
      expect(DriverService.makeOtp).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "otp sent, verify your account"
      });

    })

  });


  describe("Verify Otp", ( () => {
    it("should successfully verify otp", async () => {
      const mockVerifyData = {
        findDriverByOtp: { id: "123", name: "Test Driver" },
        token: "mockToken"
      };
      vi.mocked(DriverService.verifyOtp).mockResolvedValue(mockVerifyData);

      req.body.otp = "1234";
      await AuthController.VerifyOtp(req as Request, res as Response, next);

      expect(DriverService.verifyOtp).toHaveBeenCalledWith("1234");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "otp verified",
        data: mockVerifyData.findDriverByOtp,
        token: mockVerifyData.token
      });
    })


    it("should handle OTP verification failure", async () => {
      const mockError = new Error("Invalid OTP");
      vi.mocked(DriverService.verifyOtp).mockRejectedValue(mockError);

      req.body.otp = "invalid";
      await AuthController.VerifyOtp(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  }))




  describe("SignUp", () => {
    it("should successfully complete driver registration", async () => {
      const mockDriver = {
        _id: "mockUserId",
        firstName: "Test",
        lastName: "Driver",
        state: "TestState",
        lga: "TestLGA",
        balance: 0,
        isOnline: false,
        email: "email", 
        phone: "phone", 
        driverLiscense: "dl", 
        isVerified: false
      } as DriverI;

      vi.mocked(DriverService.completeRegistration).mockResolvedValue(mockDriver);

      req.body = {
        firstName: "Test",
        lastName: "Driver",
        state: "TestState",
        lga: "TestLGA"
      };

      await AuthController.SignUp(req as Request, res as Response, next);

      expect(DriverService.completeRegistration).toHaveBeenCalledWith(
        "mockUserId",
        {
          firstName: "Test",
          lastName: "Driver",
          state: "TestState",
          lga: "TestLGA",
          balance: 0,
          isOnline: false
        }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        data: mockDriver
      });
    });

    it("should handle registration failure", async () => {
      const mockError = new Error("Registration failed");
      vi.mocked(DriverService.completeRegistration).mockRejectedValue(mockError);

      await AuthController.SignUp(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });

});
