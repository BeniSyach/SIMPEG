export interface IUser {
  nik: string;
  password: string;
  access_token: string;
  // Tambahkan properti lain yang relevan
}

export interface IAppState {
  checked: boolean;
  loggedIn: boolean;
  user?: IUser;
}
