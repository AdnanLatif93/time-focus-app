import { api, BASE_URL } from '@services/api';
import { UploadResponse } from '@/types';

export interface DocumentPickerResult {
  uri:   string;
  name:  string;
  type:  string;
  size?: number;
}

// POST multipart/form-data to /api/upload
export const uploadSchedule = (
  file:        DocumentPickerResult,
  onProgress?: (percent: number) => void
): Promise<UploadResponse> => {
  const formData = new FormData();

  formData.append('file', {
    uri:  file.uri,
    name: file.name ?? 'schedule.xlsx',
    type: file.type ?? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  } as unknown as Blob);

  return api.upload('/upload', formData, onProgress) as Promise<UploadResponse>;
};

// Download sample template
// Opens the backend-served static .xlsx file in the device browser
// Backend serves it from apps/backend/src/assets/sample-template.xlsx
// No native modules needed — pure Linking
export const downloadSampleTemplate = async (): Promise<void> => {
  const { Linking } = await import('react-native');

  // Backend serves the file at this URL
  // User's browser will download/open it automatically
  const url = `${BASE_URL}/upload/sample-template`;

  await Linking.openURL(url);
};
