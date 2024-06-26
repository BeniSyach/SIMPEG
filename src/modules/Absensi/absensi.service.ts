import { IUAbsensi } from './absensi.typeDefs';
import axios from 'axios';
import config from '@utils/config';

export function useAbsensiService() {
  async function getAbsensi(token: string): Promise<IUAbsensi | null> {
    try {
      const response = await axios.post(
        `${config.API_URL}/api/berkas`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
