import { api } from '@services/api';
import { UploadResponse } from '@/types';

export interface DocumentPickerResult {
  uri:      string;
  name:     string;
  type:     string;
  size?:    number;
}

// POST multipart/form-data to /api/upload
export const uploadSchedule = (
  file: DocumentPickerResult,
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

// GET /api/sample-template — triggers download/share
export const downloadSampleTemplate = async (): Promise<void> => {
  // Opens the template URL in the device browser / share sheet
  const { Linking } = await import('react-native');
  const url = `${(await import('@services/api')).BASE_URL}/sample-template`;
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    throw new Error('Cannot open template URL');
  }
};
