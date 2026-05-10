import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {
  private readonly ACCESS_TOKEN = 'access_token';
  private readonly REFRESH_TOKEN = 'refresh_token';
  private readonly USER_PROFILE = 'user_profile';

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN);
  }

  setAccessToken(token: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): void {
    sessionStorage.setItem(this.REFRESH_TOKEN, token);
  }

  getUserProfile(): any {
    const profile = sessionStorage.getItem(this.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  }

  setUserProfile(profile: any): void {
    sessionStorage.setItem(this.USER_PROFILE, JSON.stringify(profile));
  }

  clear(): void {
    sessionStorage.clear();
  }
}
