'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useHookFormOptimisticAction } from '@next-safe-action/adapter-react-hook-form/hooks';
import { useEffect, useState } from 'react';
import type { Control, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { createCircle } from '@/lib/circles/create/actions/create';
import { createCircleSchema } from '@/lib/circles/create/schema';
import type { Circle } from '@/lib/circles/types';

const CIRCLE_IDS_FIELD = 'circleIds';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  initialCircles: Circle[];
  onSuccess?: () => void;
};

export function useAddCircles<T extends FieldValues>({
  form: contactForm,
  initialCircles,
  onSuccess
}: Props<T>) {
  const circleIdsPath = CIRCLE_IDS_FIELD as Path<T>;
  const [showAddCircle, setShowAddCircle] = useState(false);

  const fromDefaultValues = contactForm.formState.defaultValues?.circleIds;
  const circleIdsFromForm = contactForm.getValues(circleIdsPath);
  const defaultCircleIds: string[] = Array.isArray(fromDefaultValues)
    ? fromDefaultValues
    : Array.isArray(circleIdsFromForm)
      ? (circleIdsFromForm as string[])
      : [];

  const selectedCircleIds =
    (useWatch({
      control: contactForm.control as Control<FieldValues>,
      name: CIRCLE_IDS_FIELD,
      defaultValue: defaultCircleIds
    }) as string[] | undefined) ?? [];

  const setCircleIds = (ids: string[]) =>
    contactForm.setValue(circleIdsPath, ids as never, {
      shouldDirty: true,
      shouldTouch: true
    });

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
    const raw = contactForm.getValues(circleIdsPath);
    const current = Array.isArray(raw) ? (raw as string[]) : [];
    const next = current.includes(circleId)
      ? current.filter((id: string) => id !== circleId)
      : [...current, circleId];

    setCircleIds(next);
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
    toggleCircle,
    selectedCircleIds
  };
}
