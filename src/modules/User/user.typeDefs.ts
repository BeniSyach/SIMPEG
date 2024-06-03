export interface IUUser {
  access_token: string;
  data: {
    id: string;
    nik: number;
    nip: number;
    email: string;
    nama: string;
    photo: string;
  };
  // Tambahkan properti lain yang relevan
}

export interface UserState {
  user?: IUUser;
}
