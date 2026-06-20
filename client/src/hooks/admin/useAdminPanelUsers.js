import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminPanelUsers = (params = {}) => {
  return useQuery({
    queryKey: ['adminPanelUsers', params],
    queryFn: async () => {
      const res = await apiClient.get('/admin/panel-users', { params });
      return Array.isArray(res.data) ? res.data : (res.data.users || []);
    },
  });
};

export const useCreateAdminPanelUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/panel-users', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPanelUsers'] });
    },
  });
};

export const useUpdateAdminPanelUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/panel-users/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPanelUsers'] });
    },
  });
};

export const useDeleteAdminPanelUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/panel-users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPanelUsers'] });
    },
  });
};
