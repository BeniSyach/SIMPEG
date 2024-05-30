import { IUCpns } from './cpns.typeDefs';
import axios from 'axios';
import config from '@utils/config';

export function useCpnsService() {
  async function getCpns(token: string): Promise<IUCpns | null> {
    try {
      const response = await axios.post(
        `${config.API_URL}/api/cpns`,
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
      console.log('[##] getCpns error:', error);
      return null;
    }
  }

  return { getCpns };
}
