import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cycleApi } from '@/lib/api/cycle';
import { toast } from 'react-hot-toast';
import type { ApiError } from '@/types/api';
import type { UpdateCycleDto, CreateDayEntryDto } from '@/lib/api/cycle';

// Query keys
const CYCLES_KEY = ['cycles'];
const CYCLE_KEY = (id: string) => ['cycle', id];

// Fetch all cycles
export const useCycles = () => {
  return useQuery({
    queryKey: CYCLES_KEY,
    queryFn: cycleApi.getCycles,
  });
};

// Fetch single cycle
export const useCycle = (id: string) => {
  return useQuery({
    queryKey: CYCLE_KEY(id),
    queryFn: () => cycleApi.getCycle(id),
    enabled: !!id,
  });
};

// Create new cycle
export const useCreateCycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cycleApi.createCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CYCLES_KEY });
      toast.success('New cycle started!');
    },
    onError: (error) => {
      const message =
        (error as ApiError).response?.data?.message ||
        'Failed to start cycle';
      toast.error(message);
    },
  });
};

// Update cycle
export const useUpdateCycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCycleDto }) =>
      cycleApi.updateCycle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CYCLES_KEY });
      queryClient.invalidateQueries({ queryKey: CYCLE_KEY(id) });
      toast.success('Cycle updated!');
    },
    onError: (error) => {
      const message =
        (error as ApiError).response?.data?.message ||
        'Failed to update cycle';
      toast.error(message);
    },
  });
};

// Delete cycle
export const useDeleteCycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cycleApi.deleteCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CYCLES_KEY });
      toast.success('Cycle deleted');
    },
    onError: (error) => {
      const message =
        (error as ApiError).response?.data?.message ||
        'Failed to delete cycle';
      toast.error(message);
    },
  });
};

// End active cycle
export const useEndActiveCycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cycleApi.endActiveCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CYCLES_KEY });
      toast.success('Cycle ended');
    },
    onError: (error) => {
      const message =
        (error as ApiError).response?.data?.message ||
        'Failed to end cycle';
      toast.error(message);
    },
  });
};

// Create/Update day entry
export const useCreateOrUpdateDayEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cycleId,
      data,
    }: {
      cycleId: string;
      data: CreateDayEntryDto;
    }) => cycleApi.createOrUpdateDayEntry(cycleId, data),
    onSuccess: (_, { cycleId }) => {
      queryClient.invalidateQueries({ queryKey: CYCLES_KEY });
      queryClient.invalidateQueries({ queryKey: CYCLE_KEY(cycleId) });
      toast.success('Day entry saved');
    },
    onError: (error) => {
      const message =
        (error as ApiError).response?.data?.message ||
        'Failed to save day entry';
      toast.error(message);
    },
  });
};

// Delete day entry
export const useDeleteDayEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cycleId, date }: { cycleId: string; date: string }) =>
      cycleApi.deleteDayEntry(cycleId, date),
    onSuccess: (_, { cycleId }) => {
      queryClient.invalidateQueries({ queryKey: CYCLES_KEY });
      queryClient.invalidateQueries({ queryKey: CYCLE_KEY(cycleId) });
      toast.success('Day entry removed');
    },
    onError: (error) => {
      const message =
        (error as ApiError).response?.data?.message ||
        'Failed to remove day entry';
      toast.error(message);
    },
  });
};