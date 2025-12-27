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
  ViewGroup = '/groups/',
  EditGroup = '/edit',
  Settings = '/settings'
}

export const alwaysAllowedRoutes = [AppRoute.Landing, AppRoute.Signin];
