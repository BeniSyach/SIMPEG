export interface IUser {
  nik: string;
  password: string;
  user?: [];
}

export interface IAppState {
  checked: boolean;
  loggedIn: boolean;
  user?: IUser;
}
