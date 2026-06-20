import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useCreateOrderInquiryMutation = () => {
  return useMutation({
    mutationFn: async (orderData) => {
      const res = await apiClient.post('/order-inquiry', orderData);
      return res.data;
    },
  });
};
