export interface AccountRepositoryDefaultOptions {
  username?: string;
  phone?: string;
  countryCode?: string;
}

export interface AccountRepositoryLoginOptions
  extends AccountRepositoryDefaultOptions {
  password: string;
}
