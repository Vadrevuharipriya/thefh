import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminReferralCodes = (params = {}) => {
  return useQuery({
    queryKey: ['adminReferralCodes', params],
    queryFn: async () => {
      const res = await apiClient.get('/admin/referral-codes', { params });
      return res.data;
    },
  });
};

export const useCreateAdminReferralCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/referral-codes', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReferralCodes'] });
    },
  });
};

export const useUpdateAdminReferralCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/referral-codes/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReferralCodes'] });
    },
  });
};

export const useDeleteAdminReferralCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/referral-codes/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReferralCodes'] });
    },
  });
};
