import { AccountModel } from '../../useCases/add-account/data-add-account-protocols'

export interface LoadAccountByEmailRepository{
  load: (email: string) => Promise<AccountModel>
}
