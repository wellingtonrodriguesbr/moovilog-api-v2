import { faker } from '@faker-js/faker'

import { UserEntity } from '@/modules/user/domain/user-entity'
import { InMemoryUsersRepository } from '@/modules/user/domain/in-memory-users-repository'

export class MakeUser {
  constructor(private inMemoryUserRepository: InMemoryUsersRepository) {}
  async createInMemory(override?: Partial<UserEntity>): Promise<UserEntity> {
    const user = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      extraData: {},
      ...override,
    } as UserEntity

    const createdUser = await this.inMemoryUserRepository.create(user)

    return createdUser
  }
}
