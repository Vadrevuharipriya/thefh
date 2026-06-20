import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useBanners = (status = 'Approved') => {
  return useQuery({
    queryKey: ['banners', status],
    queryFn: async () => {
      const res = await apiClient.get('/banners', { params: { status } });
      return res.data;
    },
  });
};
