import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await apiClient.get('/products', { params });
      return res.data;
    },
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await apiClient.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data;
    },
  });
};

export const useCuisines = () => {
  return useQuery({
    queryKey: ['cuisines'],
    queryFn: async () => {
      const res = await apiClient.get('/cuisines');
      return res.data;
    },
  });
};

export const useOccasions = () => {
  return useQuery({
    queryKey: ['occasions'],
    queryFn: async () => {
      const res = await apiClient.get('/occasions');
      return res.data;
    },
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await apiClient.get('/locations');
      return res.data;
    },
  });
};

export const useChefs = () => {
  return useQuery({
    queryKey: ['chefs'],
    queryFn: async () => {
      const res = await apiClient.get('/chefs');
      return res.data;
    },
  });
};
