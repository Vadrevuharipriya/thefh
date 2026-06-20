import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminOccasions = () => {
  return useQuery({
    queryKey: ['adminOccasions'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/occasions');
      return res.data;
    },
  });
};

export const useAdminOccasion = (id) => {
  return useQuery({
    queryKey: ['adminOccasion', id],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/occasions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateAdminOccasion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/occasions', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOccasions']);
    },
  });
};

export const useUpdateAdminOccasion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/occasions/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOccasions']);
      queryClient.invalidateQueries(['adminOccasion']);
    },
  });
};

export const useDeleteAdminOccasion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/occasions/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOccasions']);
    },
  });
};

export const useUpdateAdminOccasionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.put(`/admin/occasions/${id}`, { displayStatus: status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOccasions']);
      queryClient.invalidateQueries(['adminOccasion']);
    },
  });
};
