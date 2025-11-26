import { ofetch } from 'ofetch';
import { API_BASE_URL } from "./constants";
import { AifaAuthResponse } from './index';

export class AuthManager {
  private basicToken: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(basicToken: string) {
    this.basicToken = basicToken;
  }

  async getBearerToken(): Promise<string> {
    if (this.accessToken && Date.now() < (this.tokenExpiry - 60000)) {
      return this.accessToken;
    }

    return this.refreshAccessToken();
  }

  private async refreshAccessToken(): Promise<string> {
    try {
      const response = await ofetch<AifaAuthResponse>('/token', {
        baseURL: API_BASE_URL,
        method: 'POST',
        headers: {
          'Authorization': `Basic ${this.basicToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ grant_type: 'client_credentials' })
      });

      this.accessToken = response.access_token;
      this.tokenExpiry = Date.now() + (response.expires_in * 1000);

      return this.accessToken || "";
    } catch (error) {
      throw new Error('Failed to authenticate with AIFA. Check your Basic Token.');
    }
  }
}