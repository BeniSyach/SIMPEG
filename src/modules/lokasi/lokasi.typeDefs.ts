export interface IUlokasi {
  lokasi: string;
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

export interface LokasiState {
  lokasi?: IUlokasi;
}
