import { IPasswordHasher } from '@/core/security/password-hasher'

export class FakeHasher implements IPasswordHasher {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }
  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash
  }
}
