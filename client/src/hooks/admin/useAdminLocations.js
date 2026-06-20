import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminLocations = () => {
  return useQuery({
    queryKey: ['adminLocations'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/locations');
      return res.data;
    },
  });
};

export const useCreateAdminLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/locations', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminLocations']);
    },
  });
};

export const useUpdateAdminLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/locations/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminLocations']);
    },
  });
};

export const useDeleteAdminLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/locations/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminLocations']);
    },
  });
};

export const useUpdateAdminLocationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.put(`/admin/locations/${id}`, { displayStatus: status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminLocations']);
    },
  });
};
