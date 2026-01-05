import { useQuery, useMutation } from "@tanstack/react-query";
import { userService, type CreateUserData, type UpdateUserData } from "../services/userService";
import { queryClient } from "@/shared/services/queryClient";

export function useUsers() {
  return useQuery({
    queryKey: ["/api/users"],
    queryFn: userService.getUsers,
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });
}
