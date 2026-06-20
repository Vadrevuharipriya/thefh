import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useBlogs = (params = {}) => {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: async () => {
      const res = await apiClient.get('/blogs', { params });
      return res.data;
    },
  });
};

export const useBlog = (slug) => {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await apiClient.get(`/blogs/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });
};
