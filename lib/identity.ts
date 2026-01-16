import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'vibecoding_uid';

export function getDeviceId(): string {
    if (typeof window === 'undefined') {
        return ''; // Server-side return empty
    }

    let deviceId = localStorage.getItem(STORAGE_KEY);

    if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem(STORAGE_KEY, deviceId);
    }

    return deviceId;
}

export function clearIdentity(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
    }
}
