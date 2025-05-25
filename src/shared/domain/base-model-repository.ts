export type SortDir = 'ASC' | 'DESC'

export type FindInput = {
  page?: number
  perPage?: number
  sort?: string | null
  sortDir?: SortDir | null
  filter?: string | null
}

export type FindOutput<Model> = {
  items: Model[]
  perPage: number
  total: number
  currentPage: number
  sort: string | null
  sortDir: SortDir | null
  filter: string | null
}

export interface BaseRepository<TEntity, IDType> {
  create(data: Partial<TEntity>): Promise<TEntity>
  update(id: IDType, data: Partial<TEntity>): Promise<TEntity>
  delete(id: IDType): Promise<boolean>
  findById(id: IDType): Promise<TEntity>
  find(input: FindInput): Promise<FindOutput<TEntity>>
}
