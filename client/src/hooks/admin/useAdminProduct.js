import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/products');
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

export const useCreateAdminProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/products', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cuisineMenu']);
      queryClient.invalidateQueries(['adminProducts']);
    },
  });
};

export const useUpdateAdminProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/products/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cuisineMenu']);
      queryClient.invalidateQueries(['adminProducts']);
    },
  });
};

export const useDeleteAdminProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cuisineMenu']);
      queryClient.invalidateQueries(['adminProducts']);
    },
  });
};
