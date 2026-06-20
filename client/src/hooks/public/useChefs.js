import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

// Hook to fetch all chefs/professionals
export const useChefs = () => {
  return useQuery({
    queryKey: ['chefs'],
    queryFn: async () => {
      const response = await apiClient.get('/chefs');
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a single chef by slug
export const useChef = (slug) => {
  return useQuery({
    queryKey: ['chefs', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/chefs/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};
