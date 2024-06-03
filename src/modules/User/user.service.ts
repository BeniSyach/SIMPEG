import { IUUser } from './user.typeDefs';
import axios from 'axios';
import config from '@utils/config';

export function useUserService() {
  async function getUser(token: string): Promise<IUUser | null> {
    try {
      const response = await axios.post(
        `${config.API_URL}/api/user`,
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

  return { getUser };
}
