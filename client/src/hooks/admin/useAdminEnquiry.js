import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

// Fetch all enquiries (AdminEnquiriesPage)
export const useAdminEnquiries = () => {
  return useQuery({
    queryKey: ['adminEnquiries'],
    queryFn: async () => {
      const res = await apiClient.get('/enquiries');
      return res.data;
    },
  });
};

export const useAdminEnquiriesCounts = () => {
  return useQuery({
    queryKey: ['adminEnquiriesCounts'],
    queryFn: async () => {
      const res = await apiClient.get('/inquiries/counts');
      return res.data;
    },
  });
};

export const useDeleteAdminEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/enquiries/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEnquiries'] });
      queryClient.invalidateQueries({ queryKey: ['adminEnquiriesCounts'] });
    },
  });
};

export const useUpdateAdminEnquiryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.put(`/admin/enquiries/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEnquiries'] });
    },
  });
};

// Fetch order inquiries by category (AdminOrderInquiryCategoryPage)
export const useOrderInquiriesByCategory = (category) => {
  return useQuery({
    queryKey: ['orderInquiries', category],
    queryFn: async () => {
      const res = await apiClient.get(`/inquiries/category/${category}`);
      return res.data;
    },
    enabled: !!category,
  });
};

export const useDeleteOrderInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/order-inquiry/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderInquiries'] });
    },
  });
};

export const useUpdateOrderInquiryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.put(`/order-inquiry/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderInquiries'] });
    },
  });
};
