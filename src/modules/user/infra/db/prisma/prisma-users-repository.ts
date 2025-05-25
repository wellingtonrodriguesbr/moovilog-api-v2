import { UserEntity } from '@/modules/user/domain/user-entity'
import { UsersRepository } from '@/modules/user/domain/users-repository'
import { FindInput, FindOutput } from '@/shared/domain/base-model-repository'

export class PrismaUsersRepository implements UsersRepository {
  findByEmail(email: string): Promise<UserEntity | null> {
    throw new Error('Method not implemented.')
  }
  findByPhone(phone: string): Promise<UserEntity | null> {
    throw new Error('Method not implemented.')
  }
  create(data: Partial<UserEntity>): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<UserEntity> {
    throw new Error('Method not implemented.')
  }
  find(input: FindInput): Promise<FindOutput<UserEntity>> {
    throw new Error('Method not implemented.')
  }
}
