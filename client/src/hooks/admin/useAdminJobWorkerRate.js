import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminJobWorkerRates = (params = {}) => {
  return useQuery({
    queryKey: ['adminJobWorkerRates', params],
    queryFn: async () => {
      const res = await apiClient.get('/admin/job-worker-rates', { params });
      return res.data;
    },
  });
};

export const useCreateJobWorkerRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/job-worker-rates', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobWorkerRates'] });
    },
  });
};

export const useUpdateJobWorkerRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/job-worker-rates/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobWorkerRates'] });
    },
  });
};

export const useDeleteJobWorkerRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/job-worker-rates/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminJobWorkerRates'] });
    },
  });
};
