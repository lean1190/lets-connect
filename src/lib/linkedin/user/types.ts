export interface Localized {
  es_ES: string;
}

export interface PreferredLocale {
  country: string;
  language: string;
}

export interface FirstName {
  localized: Localized;
  preferredLocale: PreferredLocale;
}

export interface ProfilePicture {
  displayImage: string;
}

export interface Me {
  localizedLastName: string;
  profilePicture: ProfilePicture;
  firstName: FirstName;
  vanityName: string;
  lastName: FirstName;
  localizedHeadline: string;
  id: string;
  headline: FirstName;
  localizedFirstName: string;
}
