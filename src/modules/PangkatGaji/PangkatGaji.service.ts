import { IUPangkatGaji } from './PangkatGaji.typeDefs';
import axios from 'axios';
import config from '@utils/config';

export function usePangkatGajiService() {
  async function getPangkatGaji(token: string): Promise<IUPangkatGaji | null> {
    try {
      const response = await axios.post(
        `${config.API_URL}/api/pangkat-gaji`,
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
      console.log('[##] getPangkatGaji error:', error);
      return null;
    }
  }

  return { getPangkatGaji };
}
