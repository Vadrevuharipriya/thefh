import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminServices = () => {
  return useQuery({
    queryKey: ['adminServices'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/services');
      return res.data;
    },
  });
};

export const useAdminService = (id) => {
  return useQuery({
    queryKey: ['adminService', id],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/services/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateAdminService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/services', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminServices']);
    },
  });
};

export const useUpdateAdminService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/services/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminServices']);
      queryClient.invalidateQueries(['adminService']);
    },
  });
};

export const useDeleteAdminService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/services/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminServices']);
    },
  });
};

export const useUpdateAdminServiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.put(`/admin/services/${id}`, { displayStatus: status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminServices']);
      queryClient.invalidateQueries(['adminService']);
    },
  });
};
