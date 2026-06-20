import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminMealsCategories = () => {
  return useQuery({
    queryKey: ['adminMealsCategories'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/meals/categories');
      return res.data;
    },
  });
};

export const useAdminMeal = (id) => {
  return useQuery({
    queryKey: ['adminMeal', id],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/meals/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateAdminMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/meals', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMealsCategories']);
    },
  });
};

export const useUpdateAdminMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/meals/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMealsCategories']);
      queryClient.invalidateQueries(['adminMeal']);
    },
  });
};

export const useDeleteAdminMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/meals/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMealsCategories']);
    },
  });
};

export const useUpdateAdminMealStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.put(`/admin/meals/${id}`, { displayStatus: status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMealsCategories']);
      queryClient.invalidateQueries(['adminMeal']);
    },
  });
};
