import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage['create']();
  }

  async setCookie(value: string): Promise<void> {
    await this._storage?.set('auth_cookie', value);
  }

  async getCookie(): Promise<string | null> {
    return await this._storage?.get('auth_cookie');
  }

  async removeCookie(): Promise<void> {
    await this._storage?.remove('auth_cookie');
  }

  async clearAll(): Promise<void> {
    await this._storage?.clear();
  }
}
