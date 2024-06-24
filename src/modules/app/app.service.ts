import { IUser } from './app.typeDefs';
import axios from 'axios';
import config from '@utils/config';

export function useAppService() {
  async function login(nik: string, password: string): Promise<IUser | null> {
    try {
      const identity = parseInt(nik, 10);
      if (isNaN(identity)) {
        throw new Error('NIK harus berupa angka yang valid');
      }
      const response = await axios.post(
        `${config.API_URL}/api/auth/login`,
        {
          identity,
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
      if (data) {
        return data;
      }

      return null;
    } catch (err) {
      console.log('Failed to fetch Login:', err);
      return Promise.reject(err);
    }
  }
  return { login };
}
