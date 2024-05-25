import { IUser } from './app.typeDefs';
import axios from 'axios';
import config from '@utils/config';

export function useAppService() {
  /**
   * function to get user data from API
   */
  async function getUser(nik: string, password: string): Promise<IUser | null> {
    try {
      const response = await axios.post(
        `${config.API_URL}/api/auth/login`,
        {
          identity: nik,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      const data = response.data;

      // Assuming the API returns user data on successful login
      if (data?.user) {
        return data.user;
      }

      return null;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      return Promise.reject(err);
    }
  }

  return { getUser };
}
