import { RegisterNewUserUseCase } from '@/modules/auth/application/use-cases/register-new-user-use-case'
import { InMemoryUsersRepository } from '@/modules/user/domain/in-memory-users-repository'
import { FakeHasher } from '@/tests/cryptography/fake-hasher'
import { UserAlreadyExistsError } from '@/modules/user/domain/errors/user-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let passwordHasher: FakeHasher
let sut: RegisterNewUserUseCase

describe('[AUTH MODULE] [USE CASE]: Register new user use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    passwordHasher = new FakeHasher()
    sut = new RegisterNewUserUseCase(inMemoryUsersRepository, passwordHasher)
  })

  it('should be able to register new user', async () => {
    const { userId } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
      phone: '15999999999',
    })

    expect(userId).toEqual(expect.any(String))
  })

  it('should not be able to register new user with an existing same phone number', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
      phone: '15999999999',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'johndoe1@example.com',
        password: '12345678',
        phone: '15999999999',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be able to register with an existing same email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
      phone: '15999999999',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '12345678',
        phone: '15999999999',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to generate a hash of the user password in the registry', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345678',
      phone: '15999999999',
    })

    const isPasswordCorrectlyHashed = await passwordHasher.hash('12345678')

    expect(isPasswordCorrectlyHashed).toEqual(expect.any(String))
    expect(inMemoryUsersRepository.items[0].password).toStrictEqual(isPasswordCorrectlyHashed)
  })
})
