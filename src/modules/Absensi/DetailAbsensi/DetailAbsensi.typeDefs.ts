export interface IUDetailAbsensi {
  kehadiran: number;
  telat: number;
  tepatWaktu: number;
  pulangCepat: number;
  TepatWaktuAbsenPulang: number;
  izin: number;
}

export interface DetailAbsensiState {
  Detailabsensi?: IUDetailAbsensi;
}
