import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useSubmitEnquiry = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/enquiries', data);
      return res.data;
    },
  });
};

export const useSubmitOrderInquiry = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/order-inquiries', data);
      return res.data;
    },
  });
};
