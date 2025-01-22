import { useQuery } from "@tanstack/react-query";
import { fetchAuthenticatedUser } from "../api/auth";

export const useFetchAuthenticatedUser = () => {
  return useQuery({
    queryKey: ["auth-user-details"],
    queryFn: fetchAuthenticatedUser,
    staleTime: 2 * 60 * 60 * 1000,
    cacheTime: 5 * 60 * 60 * 1000,
  });
};

export const useIsAuthenticated = () => {
  const { data, isLoading, error } = useFetchAuthenticatedUser();

  if (isLoading) {
    return { loading: true };
  }

  if (error || !data?.data?.authenticated) {
    return { authenticated: false, user: null, message: data?.data?.message || "Unauthenticated", loading: false };
  }

  return { authenticated: data?.data?.authenticated, user: data?.data?.user, message: data?.data?.message, loading: false };
};
