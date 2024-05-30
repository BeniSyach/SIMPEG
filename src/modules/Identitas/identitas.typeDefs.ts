export interface IUIdentitas {
  access_token: string;
  data: {
    nik: number;
    nip: number;
    nip_baru: number;
    gelar_depan: string;
    nama: string;
    gelar_belakang: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    agama: string;
    status_pegawai: string;
    status_kawin: string;
    kedudukan_pegawai: string;
    updated_at: string;
  };
  // Tambahkan properti lain yang relevan
}

export interface IdentitasState {
  identitas?: IUIdentitas;
}
