import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminCuisines = () => {
  return useQuery({
    queryKey: ['adminCuisines'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/cuisines');
      return res.data;
    },
  });
};

export const useAdminCuisineMenu = (cuisineId) => {
  return useQuery({
    queryKey: ['cuisineMenu', cuisineId],
    queryFn: async () => {
      const res = await apiClient.get(`/cuisines/${cuisineId}/menu`);
      return res.data;
    },
    enabled: !!cuisineId,
  });
};

export const useAdminCuisine = (id) => {
  return useQuery({
    queryKey: ['adminCuisine', id],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/cuisines/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateAdminCuisine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/cuisines', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCuisines']);
    },
  });
};

export const useUpdateAdminCuisine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/cuisines/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCuisines']);
      queryClient.invalidateQueries(['adminCuisine']);
    },
  });
};

export const useUpdateAdminCuisineStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.put(`/admin/cuisines/${id}`, { displayStatus: status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCuisines']);
      queryClient.invalidateQueries(['adminCuisine']);
    },
  });
};

export const useDeleteAdminCuisine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/cuisines/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCuisines']);
    },
  });
};
