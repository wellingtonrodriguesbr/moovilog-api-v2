export type IExtraDataOnboardingStep = 'register_company' | 'register_company_address' | 'complete_onboarding'

export interface UserEntityExtraData {
  onboardingStep?: IExtraDataOnboardingStep
}

export interface UserEntity {
  id: string
  name: string
  email: string
  password?: string
  phone?: string
  extraData?: UserEntityExtraData
  createdAt?: Date
  updatedAt?: Date
}
