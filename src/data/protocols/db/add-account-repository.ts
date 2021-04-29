import { AccountModel, AddAccountModel } from '../../useCases/add-account/data-add-account-protocols'

export interface AddAccountRepository{
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
