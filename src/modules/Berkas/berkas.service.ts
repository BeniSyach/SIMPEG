import { IUBerkas } from './berkas.typeDefs';
import axios from 'axios';
import config from '@utils/config';

export function useBerkasService() {
  async function getBerkas(token: string): Promise<IUBerkas | null> {
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
      console.log('[##] getBerkas error:', error);
      return null;
    }
  }

  return { getBerkas };
}
