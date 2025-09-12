import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage-service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
    sessionStorage.clear();
  });

  it('1) should be created', () => {
    expect(service).toBeTruthy();
  });

  it('2) Temporary Storage -> should set and get temporary item', () => {
    const key = 'tempKey';
    const value = { id: 1, name: 'Temp User' };
    service.setTemporaryItem(key, value);

    const result = service.getTemporaryItem(key);
    expect(result).toEqual(value);
  });

  it('3) Temporary Storage -> should return null for missing temporary item', () => {
    expect(service.getTemporaryItem('nonexistent')).toBeNull();
  });

  it('4) Temporary Storage -> should remove temporary item', () => {
    const key = 'tempKey';
    service.setTemporaryItem(key, { dummy: true });

    service.removeTemporaryItem(key);
    expect(sessionStorage.getItem(key)).toBeNull();
  });

  it('5) Persistent Storage -> should set and get persistent item', () => {
    const key = 'persistKey';
    const value = { id: 2, name: 'Persistent User' };
    service.setPersistentItem(key, value);

    const result = service.getPersistentItem(key);
    expect(result).toEqual(value);
  });

  it('6) Persistent Storage ->  should return null for missing persistent item', () => {
    expect(service.getPersistentItem('nonexistent')).toBeNull();
  });

  it('7) Persistent Storage ->  should remove persistent item', () => {
    const key = 'persistKey';
    service.setPersistentItem(key, { role: 'admin' });

    service.removePersistentItem(key);
    expect(localStorage.getItem(key)).toBeNull();
  });

  it('8) EventEmitter - selectionsChanged$ -> should emit selection change event', (done) => {
    service.selectionsChanged$.subscribe((value) => {
      expect(value).toEqual('updated');
      done();
    });
    service.selectionsChanged$.emit('updated');
  });
});
