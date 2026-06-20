import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminEvents = () => {
  return useQuery({
    queryKey: ['adminEvents'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/events');
      return res.data;
    },
  });
};

export const useCreateAdminEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/events', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminEvents']);
    },
  });
};

export const useUpdateAdminEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/events/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminEvents']);
    },
  });
};

export const useDeleteAdminEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/events/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminEvents']);
    },
  });
};

export const useReorderAdminEvents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData) => {
      const res = await apiClient.put('/admin/events/reorder', orderData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminEvents']);
    },
  });
};

export const useUpdateAdminEventStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.put(`/admin/events/${id}`, { displayStatus: status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminEvents']);
    },
  });
};
