import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminWebsitePages = () => {
  return useQuery({
    queryKey: ['adminWebsitePages'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/website-pages');
      return res.data;
    },
  });
};

export const useCreateAdminWebsitePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/website-pages', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWebsitePages'] });
    },
  });
};

export const useUpdateAdminWebsitePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/website-pages/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWebsitePages'] });
    },
  });
};

export const useDeleteAdminWebsitePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/website-pages/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWebsitePages'] });
    },
  });
};
