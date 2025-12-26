export enum AppRoute {
  Root = '/',
  Landing = '/',
  Signin = '/signin',
  Contacts = '/contacts',
  NewContact = '/contacts/new',
  EditContact = '/contacts/',
  Scan = '/scan',
  MyQr = '/my-qr',
  Groups = '/groups',
  NewGroup = '/groups/new',
  Settings = '/settings'
}

export const alwaysAllowedRoutes = [AppRoute.Landing, AppRoute.Signin];
