import { IUAbsensi } from './absensi.typeDefs';
import axios from 'axios';
export function useAbsensiService() {
  async function getAbsensi(nik: number, tahun: string): Promise<IUAbsensi | null> {
    try {
      const response = await axios.post(
        `http://103.114.111.178:3035/api/laporan/get-data-absen-pertahun`,
        {
          nik,
          tahun,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = response.data;
      if (data) {
        return data;
      }

      return null;
    } catch (error) {
      console.log('[##] getAbsensi error:', error);
      return null;
    }
  }

  return { getAbsensi };
}
