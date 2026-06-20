import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminSchedules = (mealId) => {
  return useQuery({
    queryKey: ['adminSchedules', mealId],
    queryFn: async () => {
      const res = await apiClient.get(`/meals/${mealId}/schedules`);
      return res.data;
    },
    enabled: !!mealId,
  });
};

export const useAdminSchedule = (id) => {
  return useQuery({
    queryKey: ['adminSchedule', id],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/schedules/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateAdminSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/schedules', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSchedules']);
    },
  });
};

export const useUpdateAdminSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/schedules/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSchedules']);
      queryClient.invalidateQueries(['adminSchedule']);
    },
  });
};

export const useDeleteAdminSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/schedules/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSchedules']);
    },
  });
};

export const useUpdateAdminScheduleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.put(`/admin/schedules/${id}`, { displayStatus: status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSchedules']);
      queryClient.invalidateQueries(['adminSchedule']);
    },
  });
};
