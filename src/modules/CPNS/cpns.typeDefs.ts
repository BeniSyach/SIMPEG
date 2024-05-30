export interface IUCpns {
  access_token: string;
  data: {
    id: number;
    nik: number;
    nip: number;
    nip_baru: string;
    nomor_sk_cpns: string;
    tgl_sk_cpns: string;
    tmt_cpns: string;
    golongan_ruang: string;
    updated_user: string;
    updated_at: string;
  };
  // Tambahkan properti lain yang relevan
}

export interface CpnsState {
  cpns?: IUCpns;
}
