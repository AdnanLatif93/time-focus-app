// Base API service
// 10.0.2.2 = localhost for Android emulator
// Change to your machine's LAN IP for physical device (e.g. 192.168.1.x)
export const BASE_URL = 'http://10.20.22.178:5000/api';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`GET ${endpoint} failed: ${response.status}`);
    return response.json();
  },

  post: async (endpoint: string, body: unknown) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`POST ${endpoint} failed: ${response.status}`);
    return response.json();
  },

  // Multipart upload with progress via XMLHttpRequest
  upload: (
    endpoint: string,
    formData: FormData,
    onProgress?: (percent: number) => void
  ): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}${endpoint}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  },
};
