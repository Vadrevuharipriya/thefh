import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAccountProfile = () => {
  return useQuery({
    queryKey: ['accountProfile'],
    queryFn: async () => {
      const res = await apiClient.get('/account/profile');
      return res.data;
    },
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.put('/account/profile', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['accountProfile']);
      queryClient.invalidateQueries(['authUser']);
    },
  });
};

export const useAccountAddresses = () => {
  return useQuery({
    queryKey: ['accountAddresses'],
    queryFn: async () => {
      const res = await apiClient.get('/account/addresses');
      return res.data;
    },
  });
};

export const useAddAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/account/addresses', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['accountAddresses']);
    },
  });
};

export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (index) => {
      const res = await apiClient.delete(`/account/addresses/${index}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['accountAddresses']);
    },
  });
};

export const useUserOrders = () => {
  return useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const res = await apiClient.get('/account/orders');
      return res.data;
    },
  });
};

export const useAccountLoyalty = () => {
  return useQuery({
    queryKey: ['accountLoyalty'],
    queryFn: async () => {
      const res = await apiClient.get('/account/loyalty');
      return res.data;
    },
  });
};

export const useAccountReferral = () => {
  return useQuery({
    queryKey: ['accountReferral'],
    queryFn: async () => {
      const res = await apiClient.get('/account/referral');
      return res.data;
    },
  });
};

export const useAccountPayments = () => {
  return useQuery({
    queryKey: ['accountPayments'],
    queryFn: async () => {
      const res = await apiClient.get('/account/payments');
      return res.data;
    },
  });
};

export const useAddPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/account/payments', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['accountPayments']);
    },
  });
};

export const useUpdatePaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ index, data }) => {
      const res = await apiClient.put(`/account/payments/${index}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['accountPayments']);
    },
  });
};

export const useDeletePaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (index) => {
      const res = await apiClient.delete(`/account/payments/${index}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['accountPayments']);
    },
  });
};
