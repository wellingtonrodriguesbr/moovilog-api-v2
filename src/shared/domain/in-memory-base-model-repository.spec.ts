// import { beforeEach, describe, expect, it, vitest } from 'vitest'
import { InMemoryBaseModelRepository } from '@/shared/domain/in-memory-base-model-repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

type StubModelProps = {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export class StubInMemoryBaseModelRepository extends InMemoryBaseModelRepository<StubModelProps> {
  sortableFields = ['name']

  protected async applyFilter(items: StubModelProps[], filter: string | null): Promise<StubModelProps[]> {
    if (!filter) {
      return items
    }

    return items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
  }
}

let repository: StubInMemoryBaseModelRepository

describe('[InMemoryBaseModelRepository]: Unit Tests', () => {
  beforeEach(() => {
    repository = new StubInMemoryBaseModelRepository()
  })

  describe('Create', async () => {
    it('should be able to create a new model', async () => {
      const model = await repository.create({
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      expect(repository.items).toHaveLength(1)
      expect(model).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: 'John Doe',
          email: 'johndoe@acme.com',
          password: '12345678',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      )
    })
  })

  describe('Update', async () => {
    it('should be able to update a model', async () => {
      const model = await repository.create({
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const updatedModel = await repository.update(model.id, {
        ...model,
        email: 'johndoe2@acme.com',
        password: '123456789',
      })

      expect(updatedModel.name).toStrictEqual('John Doe')
      expect(updatedModel.email).toStrictEqual('johndoe2@acme.com')
    })

    it('not should be able to update a model when resource not found', async () => {
      await expect(
        repository.update('invalid-id', {
          email: 'johndoe2@acme.com',
        }),
      ).rejects.toBeInstanceOf(NotFoundError)
    })
  })

  describe('Delete', async () => {
    it('should be able to delete a model', async () => {
      const model = await repository.create({
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await repository.delete(model.id)

      expect(repository.items).toHaveLength(0)
    })

    it('not should be able to delete a model when resource not found', async () => {
      await expect(repository.delete('invalid-id')).rejects.toBeInstanceOf(NotFoundError)
    })
  })

  describe('Find By Id', async () => {
    it('should be able to find a model by id', async () => {
      const model = await repository.create({
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const result = await repository.findById(model.id)

      expect(result.name).toStrictEqual('John Doe')
    })

    it('not should be able to find a model by id when resource not found', async () => {
      await expect(repository.findById('invalid-id')).rejects.toBeInstanceOf(NotFoundError)
    })
  })

  describe('Apply Filter', async () => {
    it('should not be able to apply filter when filter is null', async () => {
      const items = Array(10).fill({
        id: '1',
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.items = items

      const spyFilter = vitest.spyOn(items, 'filter')
      const result = await repository['applyFilter'](items, null)

      expect(result).toStrictEqual(items)
      expect(spyFilter).not.toHaveBeenCalled()
    })

    it('should be able to apply filter', async () => {
      const items = Array(10).fill({
        id: '1',
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.items = items

      const spyFilter = vitest.spyOn(items, 'filter')
      const result = await repository['applyFilter'](items, 'John Doe')

      expect(result).toHaveLength(10)
      expect(spyFilter).toHaveBeenCalledTimes(1)
    })
  })

  describe('Apply Sort', async () => {
    it('should not be able to apply sort when sort is null', async () => {
      const items = Array(10).fill({
        id: '1',
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.items = items

      const spySort = vitest.spyOn(items, 'sort')
      const result = await repository['applySort'](items, null, null)

      expect(result).toStrictEqual(items)
      expect(spySort).not.toHaveBeenCalled()
    })

    it('should be able to apply sort', async () => {
      const items = Array(10).fill({
        id: '1',
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.items = items

      let result = await repository['applySort'](items, 'name', 'ASC')
      expect(result).toStrictEqual([
        items[0],
        items[1],
        items[2],
        items[3],
        items[4],
        items[5],
        items[6],
        items[7],
        items[8],
        items[9],
      ])

      result = await repository['applySort'](items, 'name', 'DESC')
      expect(result).toStrictEqual([
        items[9],
        items[8],
        items[7],
        items[6],
        items[5],
        items[4],
        items[3],
        items[2],
        items[1],
        items[0],
      ])
    })
  })

  describe('Apply Paginate', async () => {
    it('should be able to apply paginate', async () => {
      const items = Array(10).fill({
        id: '1',
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.items = items

      const result = await repository['applyPaginate'](items, 2, 5)
      expect(result).toHaveLength(5)
      expect(result).toStrictEqual([items[5], items[6], items[7], items[8], items[9]])
    })
  })

  describe('Find', async () => {
    it('should be able to find', async () => {
      const items = Array(10).fill({
        id: '1',
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.items = items

      const result = await repository.find({ page: 1, perPage: 10, sort: null, sortDir: null, filter: null })

      expect(result).toStrictEqual(
        expect.objectContaining({
          items,
          perPage: 10,
          total: 10,
          currentPage: 1,
          sort: null,
          sortDir: null,
          filter: null,
        }),
      )
    })

    it('should be able to find with filter', async () => {
      const items = [
        {
          id: '1',
          name: 'John Doe',
          email: 'johndoe@acme.com',
          password: '12345678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '1',
          name: 'john doe',
          email: 'johndoe@acme.com',
          password: '12345678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'David Doe',
          email: 'daviddoe@acme.com',
          password: '12345678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      repository.items = items

      let result = await repository.find({ page: 1, perPage: 10, sort: null, sortDir: null, filter: 'john' })

      expect(result).toStrictEqual(
        expect.objectContaining({
          items: [items[0], items[1]],
          perPage: 10,
          total: 2,
          currentPage: 1,
          sort: null,
          sortDir: null,
          filter: 'john',
        }),
      )

      result = await repository.find({ page: 1, perPage: 10, sort: null, sortDir: null, filter: 'david' })

      expect(result).toStrictEqual(
        expect.objectContaining({
          items: [items[2]],
          perPage: 10,
          total: 1,
          currentPage: 1,
          sort: null,
          sortDir: null,
          filter: 'david',
        }),
      )
    })

    it('should be able to find with sort', async () => {
      const items = [
        {
          id: '1',
          name: 'John Doe',
          email: 'johndoe@acme.com',
          password: '12345678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'David Doe',
          email: 'daviddoe@acme.com',
          password: '12345678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      repository.items = items

      let result = await repository.find({ page: 1, perPage: 10, sort: 'name', sortDir: 'ASC', filter: null })

      expect(result).toStrictEqual(
        expect.objectContaining({
          items: [items[1], items[0]],
          perPage: 10,
          total: 2,
          currentPage: 1,
          sort: 'name',
          sortDir: 'ASC',
          filter: null,
        }),
      )

      result = await repository.find({ page: 1, perPage: 10, sort: 'name', sortDir: 'DESC', filter: null })

      expect(result).toStrictEqual(
        expect.objectContaining({
          items: [items[0], items[1]],
          perPage: 10,
          total: 2,
          currentPage: 1,
          sort: 'name',
          sortDir: 'DESC',
          filter: null,
        }),
      )
    })

    it('shoud be able to find with pagination', async () => {
      const items = Array(20).fill({
        id: '1',
        name: 'John Doe',
        email: 'johndoe@acme.com',
        password: '12345678',
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      repository.items = items

      let result = await repository.find({ page: 1, perPage: 10, sort: null, sortDir: null, filter: null })

      expect(result).toStrictEqual(
        expect.objectContaining({
          items: items.slice(0, 10),
          perPage: 10,
          total: 20,
          currentPage: 1,
          sort: null,
          sortDir: null,
          filter: null,
        }),
      )
    })

    it('should be able to find with pagination, sort and filter', async () => {
      const items = [
        {
          id: '1',
          name: 'John Doe',
          email: 'johndoe@acme.com',
          password: '12345678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'David Doe',
          email: 'daviddoe@acme.com',
          password: '12345678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          name: 'john Doe',
          email: 'Johndoe@acme.com',
          password: '12345678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '4',
          name: 'john doe',
          email: 'Johndoe@acme.com',
          password: '12345678',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      repository.items = items

      let result = await repository.find({ page: 1, perPage: 2, sort: 'name', sortDir: 'ASC', filter: 'john' })

      expect(result).toStrictEqual(
        expect.objectContaining({
          items: [items[0], items[2]],
          perPage: 2,
          total: 3,
          currentPage: 1,
          sort: 'name',
          sortDir: 'ASC',
          filter: 'john',
        }),
      )

      result = await repository.find({ page: 2, perPage: 2, sort: 'name', sortDir: 'ASC', filter: 'john' })

      expect(result).toStrictEqual(
        expect.objectContaining({
          items: [items[3]],
          perPage: 2,
          total: 3,
          currentPage: 2,
          sort: 'name',
          sortDir: 'ASC',
          filter: 'john',
        }),
      )

      result = await repository.find({ page: 1, perPage: 10, sort: 'name', sortDir: 'DESC', filter: 'david' })

      expect(result).toStrictEqual(
        expect.objectContaining({
          items: [items[1]],
          perPage: 10,
          total: 1,
          currentPage: 1,
          sort: 'name',
          sortDir: 'DESC',
          filter: 'david',
        }),
      )
    })
  })
})
