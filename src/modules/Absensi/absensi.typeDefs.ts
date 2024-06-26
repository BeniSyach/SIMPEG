export interface IUAbsensi {
  allAbsenMasuk: [
    {
      bulan_masuk: string;
      jumlah_absen: string;
    },
  ];
  // Tambahkan properti lain yang relevan
}

export interface AbsensiState {
  absensi?: IUAbsensi;
}
