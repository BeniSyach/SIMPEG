export interface IUPns {
  access_token: string;
  data: {
    nik: number;
    nip: number;
    nip_baru: number;
    nomor_sk_pns: string;
    tgl_sk_pns: string;
    tmt_pns: string;
    golongan_ruang: string;
    sumpah: string;
    tahun_sumpah: number;
    updated_at: string;
  };
  // Tambahkan properti lain yang relevan
}

export interface PnsState {
  pns?: IUPns;
}
