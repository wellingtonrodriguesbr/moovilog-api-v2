import { UsersRepository } from '@/modules/user/domain/users-repository'
import { UserEntity } from '@/modules/user/domain/user-entity'

import { InMemoryBaseModelRepository } from '@/shared/domain/in-memory-base-model-repository'

export class InMemoryUsersRepository extends InMemoryBaseModelRepository<UserEntity> implements UsersRepository {
  items: UserEntity[] = []
  sortableFields: string[] = ['name', 'createdAt']

  protected async applyFilter(items: UserEntity[], filter: string | null): Promise<UserEntity[]> {
    if (!filter) {
      return items
    }

    const searchTerm = filter.toLowerCase()

    return items.filter(user => {
      return (
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.phone?.toLowerCase().includes(searchTerm)
      )
    })
  }

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
