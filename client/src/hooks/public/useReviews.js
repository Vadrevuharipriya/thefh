import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await apiClient.get('/reviews');
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};
