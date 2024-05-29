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
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data as IUlokasi;
    } catch (error) {
      console.error('[##] getlokasi error:', error);
      return null;
    }
  }

  return { getlokasi };
}
