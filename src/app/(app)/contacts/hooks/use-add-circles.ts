'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormOptimisticAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useEffect, useState } from 'react';
import { createCircle } from '@/lib/circles/create/actions/create';
import { createCircleSchema } from '@/lib/circles/create/schema';
import type { Circle } from '@/lib/circles/types';

type Props = {
  initialCircles: Circle[];
  onSuccess?: () => void;
  getSelectedCircleIds: () => string[];
  setSelectedCircleIds: (ids: string[]) => void;
};

export function useAddCircles({
  initialCircles,
  onSuccess,
  getSelectedCircleIds,
  setSelectedCircleIds
}: Props) {
  const [showAddCircle, setShowAddCircle] = useState(false);

  const {
    form: circleForm,
    action: circleAction,
    handleSubmitWithAction: handleCreateCircleSubmit
  } = useHookFormOptimisticAction(createCircle, zodResolver(createCircleSchema), {
    actionProps: {
      currentState: { circles: initialCircles },
      updateFn: (state, input) => {
        const optimisticCircle: Circle = {
          ...input,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: null,
          color: input.color || null,
          description: input.description || null,
          icon: input.icon || null,
          favorite: false
        };

        return { circles: [...state.circles, optimisticCircle] };
      },
      onSuccess: () => {
        setShowAddCircle(false);
        circleForm.reset();
        onSuccess?.();
      }
    },
    formProps: {
      defaultValues: {
        name: '',
        description: null,
        color: null,
        icon: null
      }
    }
  });

  const circles = circleAction.optimisticState?.circles || initialCircles;

  const toggleCircle = (circleId: string) => {
    const selectedCircleIds = getSelectedCircleIds();
    const updatedSelectedCircles = selectedCircleIds.includes(circleId)
      ? selectedCircleIds.filter((id) => id !== circleId)
      : [...selectedCircleIds, circleId];

    setSelectedCircleIds(updatedSelectedCircles);
  };

  const hideAddCircleForm = () => {
    setShowAddCircle(false);
    circleForm.reset();
  };

  const saveNewCircle = (e?: React.BaseSyntheticEvent) => {
    setShowAddCircle(false);
    handleCreateCircleSubmit(e);
  };

  useEffect(() => {
    if (circleAction.result?.serverError) {
      alert(`Error: ${circleAction.result.serverError}`);
    }
  }, [circleAction.result]);

  return {
    circles,
    circleForm,
    circleAction,
    showAddCircle,
    setShowAddCircle,
    handleCreateCircleSubmit,
    hideAddCircleForm,
    saveNewCircle,
    toggleCircle
  };
}
