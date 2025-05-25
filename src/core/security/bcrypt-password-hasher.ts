import * as bcrypt from 'bcryptjs'
import { IPasswordHasher } from './password-hasher'

export class BcryptPasswordHasher implements IPasswordHasher {
  private HASH_SALT_LENGTH = 8

  async hash(plainPassword: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(plainPassword, this.HASH_SALT_LENGTH)
    return hashedPassword
  }

  async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const passwordsMatch = await bcrypt.compare(plainPassword, hashedPassword)
    return passwordsMatch
  }
}
