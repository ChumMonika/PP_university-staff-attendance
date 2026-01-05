import bcrypt from "bcrypt";
import IStorage from "../interfaces/IStorage";
import { UnauthorizedError } from "../errors";

export interface LoginResponse {
  role: string;
  name: string;
  id: number;
  uniqueId: string;
}

export class AuthUseCase {
  constructor(private storage: IStorage) {}

  async login(uniqueId: string, password: string): Promise<LoginResponse> {
    const user = await this.storage.getUserByUniqueId(uniqueId);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Compare hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    return {
      role: user.role,
      name: user.name,
      id: user.id,
      uniqueId: user.uniqueId,
    };
  }
}
