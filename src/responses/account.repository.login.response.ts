export interface AccountRepositoryLoginResponseRootObject {
  access_token: string;
}

export interface AccountRepositoryLoginResponseUser
  extends AccountRepositoryLoginResponseRootObject {
  user?: AccountRepositoryLoginResponseUserObject;
}

export interface AccountRepositoryLoginResponseUserObject {
  id: string;
  firstName: string;
  lastName: string;
  loginEmail: string;
  loginPhone: string;
}
