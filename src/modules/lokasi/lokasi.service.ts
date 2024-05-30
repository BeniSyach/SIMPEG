import { IUlokasi } from './lokasi.typeDefs';
import axios from 'axios';
import config from '@utils/config';

export function useLokasiService() {
  async function getlokasi(token: string): Promise<IUlokasi | null> {
    try {
      const response = await axios.post(
        `${config.API_URL}/api/lokasi`,
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
      console.log('[##] getlokasi error:', error);
      return null;
    }
  }

  return { getlokasi };
}
