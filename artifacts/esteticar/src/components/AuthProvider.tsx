import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  isLoading: true,
  isAuthenticated: false,
  refetchUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { data: user, isLoading, isError, refetch } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
    },
  });

  const handleRefetch = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user: isError ? null : user,
        isLoading,
        isAuthenticated: !!user && !isError,
        refetchUser: handleRefetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
