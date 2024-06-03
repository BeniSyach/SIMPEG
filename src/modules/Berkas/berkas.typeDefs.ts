export interface IUBerkas {
  access_token: string;
  data: [
    {
      id: string;
      nik: number;
      jenis_berkas: string;
      nomor_berkas: string;
      tgl_mulai: string;
      tgl_akhir: string;
      file: string;
    },
  ];
  // Tambahkan properti lain yang relevan
}

export interface BerkasState {
  berkas?: IUBerkas;
}
