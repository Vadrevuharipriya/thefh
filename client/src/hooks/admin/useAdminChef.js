import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

export const useAdminChefs = (params = {}) => {
  return useQuery({
    queryKey: ['adminChefs', params],
    queryFn: async () => {
      const res = await apiClient.get('/admin/chefs', { params });
      return res.data;
    },
  });
};

export const useAdminJobWorkers = (params = {}) => {
  return useQuery({
    queryKey: ['adminJobWorkers', params],
    queryFn: async () => {
      const [localRes, firebaseRes] = await Promise.all([
        apiClient.get('/admin/chefs/admin', { params }),
        apiClient.get('/admin/firebase/chefs', { params })
      ]);
      return { local: localRes.data, firebase: firebaseRes.data };
    },
  });
};

export const useAdminChefById = (id) => {
  return useQuery({
    queryKey: ['adminChef', id],
    queryFn: async () => {
      if (!id || id === 'new') return null;
      try {
        const res = await apiClient.get(`/admin/chefs/${id}`);
        return res.data;
      } catch (err) {
        return null;
      }
    },
    enabled: !!id && id !== 'new',
    retry: false,
  });
};

export const useAdminFirebaseChefs = () => {
  return useQuery({
    queryKey: ['adminFirebaseChefs'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/firebase/chefs');
      return res.data;
    },
    retry: false,
  });
};

export const useAdminChefBookings = (workerId) => {
  return useQuery({
    queryKey: ['adminChefBookings', workerId],
    queryFn: async () => {
      if (!workerId) return [];
      const res = await apiClient.get(`/admin/firebase/chefs/${workerId}/bookings`);
      return res.data;
    },
    enabled: !!workerId,
    retry: false,
  });
};

export const useCreateChef = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/admin/chefs', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminChefs'] });
      queryClient.invalidateQueries({ queryKey: ['chefs'] });
    },
  });
};

export const useUpdateChef = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/admin/chefs/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminChefs'] });
      queryClient.invalidateQueries({ queryKey: ['chefs'] });
    },
  });
};

export const useDeleteChef = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/admin/chefs/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminChefs'] });
      queryClient.invalidateQueries({ queryKey: ['chefs'] });
    },
  });
};
