export enum AppRoute {
  Root = '/',
  Landing = '/',
  Signin = '/signin',
  Contacts = '/contacts',
  Scan = '/scan',
  Groups = '/groups',
  Settings = '/settings'
}

export const alwaysAllowedRoutes = [AppRoute.Landing, AppRoute.Signin];
