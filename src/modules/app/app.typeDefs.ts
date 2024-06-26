export interface IUser {
  nik: string;
  password: string;
  access_token: string;
  data: {
    email: string;
    nama: string;
    nik: number;
    nip: number;
    photo: string;
  };
  // Tambahkan properti lain yang relevan
}

export interface IAppState {
  checked: boolean;
  loggedIn: boolean;
  user?: IUser;
}
