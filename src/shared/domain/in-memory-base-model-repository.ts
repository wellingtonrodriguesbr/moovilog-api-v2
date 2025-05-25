import { randomUUID } from 'node:crypto'
import { FindInput, FindOutput, BaseRepository, SortDir } from '@/shared/domain/base-model-repository'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'

export type ModelProps = {
  id: string
  [key: string]: any
}

export abstract class InMemoryBaseModelRepository<Model extends ModelProps> implements BaseRepository<Model, string> {
  items: Model[] = []
  sortableFields: string[] = []

  async create(data: Partial<Model>): Promise<Model> {
    const item = {
      id: data.id ?? randomUUID(),
      ...data,
    } as Model

    this.items.push(item)

    return item
  }

  async update(id: string, data: Partial<Model>): Promise<Model> {
    await this._get(id)
    const itemIndex = this.items.findIndex(item => item.id === id)

    this.items[itemIndex] = {
      ...this.items[itemIndex],
      ...data,
    }

    return this.items[itemIndex]
  }

  async delete(id: string): Promise<boolean> {
    await this._get(id)
    const itemIndex = this.items.findIndex(item => item.id === id)

    this.items.splice(itemIndex, 1)
    return true
  }

  async findById(id: string): Promise<Model> {
    await this._get(id)
    const item = this.items.find(item => item.id === id)

    return item as Model
  }

  async find(input: FindInput): Promise<FindOutput<Model>> {
    const page = input.page ?? 1
    const perPage = input.perPage ?? 10
    const sort = input.sort ?? null
    const sortDir = input.sortDir ?? null
    const filter = input.filter ?? null

    const filteredItems = await this.applyFilter(this.items, filter)
    const sortedItems = await this.applySort(filteredItems, sort, sortDir)
    const paginatedItems = await this.applyPaginate(sortedItems, page, perPage)

    return {
      items: paginatedItems,
      perPage,
      total: filteredItems.length,
      currentPage: page,
      sort,
      sortDir,
      filter,
    }
  }

  protected abstract applyFilter(items: Model[], filter: string | null): Promise<Model[]>

  protected async applySort(items: Model[], sort: string | null, sortDir: SortDir | null): Promise<Model[]> {
    if (!sort || !this.sortableFields.includes(String(sort))) {
      return items
    }

    return [...items].sort((a, b) => {
      if (a[sort] < b[sort]) return sortDir === 'ASC' ? -1 : 1
      if (a[sort] > b[sort]) return sortDir === 'ASC' ? 1 : -1
      return 0
    })
  }

  protected async applyPaginate(items: Model[], page: number, perPage: number): Promise<Model[]> {
    const start = (page - 1) * perPage
    const limit = start + perPage

    return items.slice(start, limit)
  }

  protected async _get(id: string): Promise<Model> {
    const model = this.items.find(item => item.id === id)

    if (!model) {
      throw new NotFoundError(`Model not found using ID ${id}`)
    }

    return model
  }
}
