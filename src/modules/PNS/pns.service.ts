import { IUPns } from './pns.typeDefs';
import axios from 'axios';
import config from '@utils/config';

export function usePnsService() {
  async function getPns(token: string): Promise<IUPns | null> {
    try {
      const response = await axios.post(
        `${config.API_URL}/api/pns`,
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
      console.log('[##] getPns error:', error);
      return null;
    }
  }

  return { getPns };
}
