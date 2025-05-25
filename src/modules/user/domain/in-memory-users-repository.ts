import { UsersRepository } from '@/modules/user/domain/users-repository'
import { UserEntity } from '@/modules/user/domain/user-entity'

import { InMemoryBaseModelRepository } from '@/shared/domain/in-memory-base-model-repository'

export abstract class InMemoryUsersRepository
  extends InMemoryBaseModelRepository<UserEntity>
  implements UsersRepository
{
  items: UserEntity[] = []
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = this.items.find(user => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const user = this.items.find(user => user.phone === phone)

    if (!user) {
      return null
    }

    return user
  }
}
