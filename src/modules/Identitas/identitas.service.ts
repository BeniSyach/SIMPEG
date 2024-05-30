import { IUIdentitas } from './identitas.typeDefs';
import axios from 'axios';
import config from '@utils/config';

export function useIdentitasService() {
  async function getIdentitas(token: string): Promise<IUIdentitas | null> {
    try {
      const response = await axios.post(
        `${config.API_URL}/api/identitas`,
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
      console.error('[##] getIdentitas error:', error);
      return null;
    }
  }

  return { getIdentitas };
}
