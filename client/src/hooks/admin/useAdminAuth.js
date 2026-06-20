import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await apiClient.post('/admin/login', credentials);
      return res.data;
    },
  });
};

export const useAdminLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/admin/logout');
      return res.data;
    },
  });
};
