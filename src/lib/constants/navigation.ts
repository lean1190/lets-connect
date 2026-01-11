export enum AppRoute {
  Root = '/',
  Landing = '/',
  Signin = '/signin',
  Contacts = '/contacts',
  NewContact = '/contacts/new',
  EditContact = '/contacts/',
  Scan = '/scan',
  MyQr = '/my-qr',
  Circles = '/circles',
  NewCircle = '/circles/new',
  EditCircle = '/circles/',
  Settings = '/settings',
  About = '/about',
  Events = '/events'
}

export const alwaysAllowedRoutes = [AppRoute.Landing, AppRoute.Signin];
