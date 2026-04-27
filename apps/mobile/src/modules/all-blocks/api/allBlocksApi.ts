import { api } from '@services/api';
import { TimeBlock } from '@/types';

export const getAllBlocks = async (): Promise<TimeBlock[]> => {
  const res = await api.get('/blocks');
  // Response shape: { success, data: TimeBlock[] }
  return res?.data ?? [];
};

export const getBlockById = async (id: string): Promise<TimeBlock> => {
  const res = await api.get(`/blocks/${id}`);
  return res?.data;
};
