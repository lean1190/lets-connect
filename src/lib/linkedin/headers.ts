import { apiVersion } from './constants';

export function linkedInHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: '*/*',
    'User-Agent': 'First-Comment/1.0',
    'Content-Type': 'application/json',
    'LinkedIn-Version': apiVersion,
    'X-Restli-Protocol-Version': '2.0.0',
    'Access-Control-Allow-Origin': '*'
  };
}
