export interface IUlokasi {
  access_token: string;
  data: {
    id: string;
    nik: number;
    nip: number;
    nama: string;
    unit_kerja: string;
    sub_unit_kerja: string;
    jenis_jabatan: string;
    jabatan: string;
    kd_unit_kerja: string;
    kd_sub_unit_kerja: string;
    kd_jenis_jabatan: string;
    kd_jabatan: string;
    updated_user: string;
    updated_at: string;
  };
  // Tambahkan properti lain yang relevan
}

export interface LokasiState {
  lokasi?: IUlokasi;
}
