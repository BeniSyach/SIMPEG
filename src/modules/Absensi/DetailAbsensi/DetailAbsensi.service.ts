import { IUDetailAbsensi } from './DetailAbsensi.typeDefs';
import axios from 'axios';
export function useDetailAbsensiService() {
  async function getDetailAbsensi(
    nik: number,
    bulan: string,
    tahun: string,
  ): Promise<IUDetailAbsensi | null> {
    try {
      const response = await axios.post(
        `http://103.114.111.178:3035/api/laporan/get-data-absen-perbulan`,
        {
          nik,
          bulan,
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
      console.log('[##] getDetailAbsensi error:', error);
      return null;
    }
  }

  return { getDetailAbsensi };
}
