export interface IUPangkatGaji {
  access_token: string;
  data: [
    {
      id: string;
      nik: number;
      ditetapkan: string;
      nomor_sk: string;
      tgl_sk: string;
      tmt_pangkat: string;
      golongan_ruang: string;
      masa_kerja_tahun: string;
      masa_kerja_bulan: string;
      tmt_gaji_berkala: string;
      masa_kerja_gaji_tahun: string;
      masa_kerja_gaji_bulan: string;
      gaji_pokok: string;
      created_user: string;
      updated_user: string;
      created_at: string;
      updated_at: string;
    },
  ];
  // Tambahkan properti lain yang relevan
}

export interface PangkatGajiState {
  PangkatGaji?: IUPangkatGaji;
}
