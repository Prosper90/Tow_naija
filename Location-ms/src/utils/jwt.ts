import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Config } from "./interface";
import ErrorResponse from "./errorResponse";
import config from "../config";

class JWT {
  private config: Config;

  constructor() {
    this.config = config;
  }

  public createToken = (payload: string) => {
    const tokenSigned = sign(
      { id: payload },
      this.config.JWT_SECRET as string | null,
      {
        expiresIn: "2h",
      }
    );
    return tokenSigned;
  };

  public verifyToken = (payload: string): Promise<JwtPayload> => {
    return new Promise((resolve, reject) => {
      verify(payload, this.config.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(new ErrorResponse("Invalid token", 401));
        } else {
          resolve(decoded as JwtPayload);
        }
      });
    });
  };
}

export default JWT;
