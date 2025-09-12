import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public selectionsChanged$: EventEmitter<any>;

  private readonly persistentLocation: Storage;
  private readonly temporaryLocation: Storage;
  constructor() {
    this.selectionsChanged$ = new EventEmitter();
    this.persistentLocation = localStorage;
    this.temporaryLocation = sessionStorage;
  }

  setTemporaryItem(key: string, item: any) {
    this.temporaryLocation.setItem(key, JSON.stringify(item));
  }

  getTemporaryItem(key: string): any {
    const value = this.temporaryLocation.getItem(key); 
     if (value !== null) {
        return JSON.parse(value);
      }
      return null;
  }

  removeTemporaryItem(key: string) {
    this.temporaryLocation.removeItem(key);
  }

  setPersistentItem(key: string, item: any) {
    this.persistentLocation.setItem(key, JSON.stringify(item));
  }

  getPersistentItem(key: string): any {
     const value = this.persistentLocation.getItem(key); 
      if (value !== null) {
        return JSON.parse(value);
      }
      return null;
  }

  removePersistentItem(key: string) {
    this.persistentLocation.removeItem(key);
  }
}
