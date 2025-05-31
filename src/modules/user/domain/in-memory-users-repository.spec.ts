import { InMemoryUsersRepository } from '@/modules/user/domain/in-memory-users-repository'
import { MakeUser } from '@/tests/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let makeUser: MakeUser

describe('[InMemoryUsersRepository]: Unit Tests', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    makeUser = new MakeUser(inMemoryUsersRepository)
  })

  describe('Find By Email', async () => {
    it('should be able to find user by email', async () => {
      await makeUser.createInMemory({
        email: 'johndoe@acme.com',
      })

      const user = await inMemoryUsersRepository.findByEmail('johndoe@acme.com')

      expect(user).toBeTruthy()
      expect(user).toEqual(expect.objectContaining({ email: 'johndoe@acme.com' }))
    })
  })

  describe('Find By Phone', async () => {
    it('should be able to find user by phone', async () => {
      await makeUser.createInMemory({
        phone: '15999999999',
      })

      const user = await inMemoryUsersRepository.findByPhone('15999999999')

      expect(user).toBeTruthy()
      expect(user).toEqual(expect.objectContaining({ phone: '15999999999' }))
    })
  })
})
