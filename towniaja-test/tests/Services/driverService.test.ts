import { beforeAll, describe, it, expect, vi } from "vitest";
import JWT from "../../utils/jwt";
import DriverRepository from "../../repositories/driverRepository";
import DriverService from "../../services/driverService";
import { DriverI } from "../../utils/interface";


// Mock dependencies
vi.mock('../../repositories/driverRepository');
vi.mock('../../utils/jwt', () => ({
    default: class {
      createToken = vi.fn()
    }
  }));
  

describe("Driver Service", () => {
  let mockDriverRepository: DriverRepository;
  let mockJWT: JWT;

  beforeAll(() => {
    mockDriverRepository = new DriverRepository() as DriverRepository;
    mockJWT = new JWT() as JWT;
    DriverService.setRepository(mockDriverRepository);

    vi.clearAllMocks();
  });

  describe("OTP Verification", () => {
    it("should verify otp successfully", async () => {
      const mockDriver = {
        email: 'test@example.com',
        otp: 1234,
        otpExpire: new Date(Date.now() + 5 * 60 * 1000),
        balance: 100,
        isVerified: false
      } as DriverI;

      //create a driver
      const resultCreateDriver = await DriverService.makeOtp(mockDriver.email, false);

      const findOneByFieldSpy  = vi.spyOn(mockDriverRepository, 'findOneByField').mockResolvedValue(mockDriver);
      const updateSpy = vi.spyOn(mockDriverRepository, 'update').mockResolvedValue({...mockDriver, isVerified: true} as DriverI);
      const createTokenSpy = vi.spyOn(mockJWT, 'createToken').mockReturnValue('mockToken');

      const result = await DriverService.verifyOtp(1234);

      expect(findOneByFieldSpy).toHaveBeenCalledWith({ otp: 1234 });
      expect(updateSpy).toHaveBeenCalledOnce();
    //   expect(result.token).toBe("mockToken");
    });

    it("should fail verification by wrong otp", async () => {
        vi.mocked(mockDriverRepository.findOneByField).mockResolvedValue(null);

      await expect(DriverService.verifyOtp(9999)).rejects.toThrow("otp not valid");
    });

    it("should throw error for expired otp", async () => {
      const mockDriver = {
        email: 'test@example.com',
        otp: 1234,
        otpExpire: new Date(Date.now() - 5 * 60 * 1000), // expired in the past
      } as DriverI;
      
    // Mock findOneByField to return the expired OTP driver
    vi.mocked(mockDriverRepository.findOneByField).mockResolvedValue(mockDriver);

    // Test that verifyOtp throws the expected error
    await expect(DriverService.verifyOtp(1234)).rejects.toThrow(
        "Otp is expired, get a new one"
    );
    });
  });

  describe("Making OTP", () => {
    it("should make otp for new driver", async () => {
      const email = 'test@example.com';
      const mockDriver = {
        _id: 'driver123',
        email: 'test@example.com',
        otp: 1234,
        otpExpire: new Date(Date.now() + 5 * 60 * 1000),
        balance: 100,
        isVerified: false
      } as DriverI;
      

      await mockDriverRepository.create(mockDriver);

      vi.mocked(mockDriverRepository.create).mockResolvedValue({
        email: email,
        otp: expect.any(Number),
        otpExpire: expect.any(Date)
      } as DriverI);

      const result = await DriverService.makeOtp(email, false);

      expect(mockDriverRepository.create).toHaveBeenCalledWith({
        email: email,
        otp: expect.any(Number),
        otpExpire: expect.any(Date)
      });
      expect(result.otp).toBeDefined();
      expect(result.otpExpire).toBeDefined();
    });

    it("should make otp for existing driver", async () => {
      const phone = '1234567890';
      const mockDriver = {
        _id: 'driver123',
        email: 'test@example.com',
        phone: '1234567890',
        otp: 1234,
        otpExpire: new Date(Date.now() + 5 * 60 * 1000),
        balance: 100,
        isVerified: false
      } as DriverI;
      

      await mockDriverRepository.create(mockDriver);
      vi.mocked(mockDriverRepository.update).mockResolvedValue({
        phone: phone,
        otp: expect.any(Number),
        otpExpire: expect.any(Date)
      } as DriverI);

      const result = await DriverService.makeOtp(phone, true);

      expect(mockDriverRepository.update).toHaveBeenCalledWith(
        'phone', 
        phone, 
        {
          otp: expect.any(Number),
          otpExpire: expect.any(Date)
        }
      );
      expect(result.otp).toBeDefined();
      expect(result.otpExpire).toBeDefined();
    });
  });

  describe("Additional Service Methods", () => {
    it("should complete registration", async () => {
      const id = 'driver123';
      const options = { firstName: 'John', lastName: 'Doe' };

      vi.mocked(mockDriverRepository.update).mockResolvedValue({
        _id: id,
        ...options
      } as DriverI);

      const result = await DriverService.completeRegistration(id, options);

      expect(mockDriverRepository.update).toHaveBeenCalledWith('_id', id, options);
      expect(result).toEqual(expect.objectContaining(options));
    });

    it("should check existing driver", async () => {
      const email = 'test@example.com';

      vi.mocked(mockDriverRepository.findOneByField).mockResolvedValue({ email } as DriverI);

      const result = await DriverService.checkExisting({ email });

      expect(result).toBe(true);
    });

    it("should toggle online status", async () => {
      const id = 'driver123';
      const mockDriver = { _id: id, isOnline: false };

      vi.mocked(mockDriverRepository.findById).mockResolvedValue(mockDriver as DriverI);
      vi.mocked(mockDriverRepository.update).mockResolvedValue({...mockDriver, isOnline: true} as DriverI);

      const result = await DriverService.activateBeingOnline(id);

      expect(mockDriverRepository.findById).toHaveBeenCalledWith(id);
      expect(mockDriverRepository.update).toHaveBeenCalledWith('_id', id, { isOnline: true });
      expect(result).toBe(true);
    });
  });

  describe("Financial Methods", () => {
    it("should withdraw funds", async () => {
      const id = 'driver123';
      const amount = 50;

      vi.mocked(mockDriverRepository.decrement).mockResolvedValue({
        _id: id,
        balance: 100 - amount
      } as DriverI);

      const result = await DriverService.withdraw(id, amount);

      expect(mockDriverRepository.decrement).toHaveBeenCalledWith(id, amount);
      expect(result.balance).toBe(50);
    });

    it("should deposit funds", async () => {
      const id = 'driver123';
      const amount = 50;

      vi.mocked(mockDriverRepository.increment).mockResolvedValue({
        _id: id,
        balance: 100 + amount
      } as DriverI);

      const result = await DriverService.deposit(id, amount);

      expect(mockDriverRepository.increment).toHaveBeenCalledWith(id, amount);
      expect(result.balance).toBe(150);
    });
  });
});