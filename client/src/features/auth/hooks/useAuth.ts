import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, type LoginResponse } from "../services/authService";

export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ uniqueId, password }: { uniqueId: string; password: string }) =>
      authService.login(uniqueId, password),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const currentUserQuery = useQuery({
    queryKey: ["/api/me"],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    currentUser: currentUserQuery.data,
    isLoadingUser: currentUserQuery.isLoading,
    isAuthenticated: !!currentUserQuery.data,
  };
}
