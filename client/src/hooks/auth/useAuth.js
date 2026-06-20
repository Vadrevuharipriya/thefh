import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/axiosInstance';

// Fetch the currently authenticated user
export const useUserQuery = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/auth/me');
        return res.data;
      } catch (error) {
        return null;
      }
    },
    // Don't retry auth queries immediately if they fail (e.g. 401)
    retry: false,
  });
};

// Login Mutation
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const res = await apiClient.post('/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      // Update the user query cache with the returned user
      queryClient.setQueryData(['authUser'], data.user || data);
    },
  });
};

// Signup Mutation
export const useSignupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const res = await apiClient.post('/auth/signup', userData);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['authUser'], data.user || data);
    },
  });
};

// Logout Mutation
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/auth/logout');
      return res.data;
    },
    onSuccess: () => {
      // Clear the user from cache
      queryClient.setQueryData(['authUser'], null);
    },
  });
};
