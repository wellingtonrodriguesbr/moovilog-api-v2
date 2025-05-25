import { BaseRepository } from '@/shared/domain/base-model-repository'
import { UserEntity } from '@/modules/user/domain/user-entity'

export interface UsersRepository extends BaseRepository<UserEntity, string> {
  findByEmail(email: string): Promise<UserEntity | null>
  findByPhone(phone: string): Promise<UserEntity | null>
}
