import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Dashboard stats query
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard-stats')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      return response.json()
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
  })
}

// Weather query
export function useWeather() {
  return useQuery({
    queryKey: ['weather'],
    queryFn: async () => {
      const response = await fetch('/api/weather')
      if (!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      return response.json()
    },
    refetchInterval: 1000 * 60 * 10, // Refetch every 10 minutes
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  })
}

// Users query with pagination and filtering
export function useUsers(options = {}) {
  const { page = 1, limit = 1000, approved = true } = options

  return useQuery({
    queryKey: ['users', { page, limit, approved }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        approved: approved.toString(),
      })
      const response = await fetch(`/api/users?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Individual user query
export function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      return response.json()
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

// Delete user mutation with optimistic updates
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete user')
      }

      return response.json()
    },
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] })
      await queryClient.cancelQueries({ queryKey: ['user', userId] })

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['users'])
      const previousUser = queryClient.getQueryData(['user', userId])

      // Optimistically remove user from cache
      queryClient.setQueryData(['users'], (old) => {
        if (!old) return old
        return old.filter(user => user.id !== userId)
      })

      // Remove individual user cache
      queryClient.removeQueries({ queryKey: ['user', userId] })

      return { previousUsers, previousUser }
    },
    onError: (err, userId, context) => {
      // Revert optimistic update on error
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
      if (context?.previousUser) {
        queryClient.setQueryData(['user', userId], context.previousUser)
      }
    },
    onSettled: () => {
      // Refetch to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Create user mutation
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create user')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, data }) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update user')
      }

      return response.json()
    },
    onMutate: async ({ userId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] })
      await queryClient.cancelQueries({ queryKey: ['user', userId] })

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData(['users'])
      const previousUser = queryClient.getQueryData(['user', userId])

      // Optimistically update user in cache
      queryClient.setQueryData(['user', userId], (old) => {
        if (!old) return old
        return { ...old, ...data }
      })

      queryClient.setQueryData(['users'], (old) => {
        if (!old) return old
        return old.map(user =>
          user.id === userId ? { ...user, ...data } : user
        )
      })

      return { previousUsers, previousUser }
    },
    onError: (err, { userId }, context) => {
      // Revert optimistic update on error
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
      if (context?.previousUser) {
        queryClient.setQueryData(['user', userId], context.previousUser)
      }
    },
    onSettled: (data, error, { userId }) => {
      // Refetch to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}
