import { UserAlreadyExistsError } from '@/modules/user/domain/errors/user-already-exists-error'
import { UsersRepository } from '@/modules/user/domain/users-repository'
import { IPasswordHasher } from '@/core/security/password-hasher'

interface RegisterUserUseCaseInput {
  name: string
  email: string
  password: string
  phone: string
}
interface RegisterUserUseCaseOutput {
  userId: string
}

export class RegisterNewUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: IPasswordHasher,
  ) {}
  async execute(input: RegisterUserUseCaseInput): Promise<RegisterUserUseCaseOutput> {
    const [userAlreadyExistsSameEmail, userAlreadyExistsSamePhone] = await Promise.all([
      this.usersRepository.findByEmail(input.email),
      this.usersRepository.findByPhone(input.phone),
    ])

    if (userAlreadyExistsSameEmail || userAlreadyExistsSamePhone) {
      throw new UserAlreadyExistsError('User already exists with same email or phone')
    }

    const hashedPassword = await this.passwordHasher.hash(input.password)

    const user = await this.usersRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
    })

    return { userId: user.id }
  }
}
