// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseQueryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { DefaultService } from '../requests/services.gen';
import * as Common from './common';
export const useDefaultServiceGetApiSensorsByIdSuspense = <
  TData = Common.DefaultServiceGetApiSensorsByIdDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    id,
  }: {
    id: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiSensorsByIdKeyFn({ id }, queryKey),
    queryFn: () => DefaultService.getApiSensorsById({ id }) as TData,
    ...options,
  });
export const useDefaultServiceGetApiSensorsByOfficeIdSuspense = <
  TData = Common.DefaultServiceGetApiSensorsByOfficeIdDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    officeId,
  }: {
    officeId: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiSensorsByOfficeIdKeyFn(
      { officeId },
      queryKey,
    ),
    queryFn: () =>
      DefaultService.getApiSensorsByOfficeId({ officeId }) as TData,
    ...options,
  });
export const useDefaultServiceGetApiSensorsSuspense = <
  TData = Common.DefaultServiceGetApiSensorsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiSensorsKeyFn(queryKey),
    queryFn: () => DefaultService.getApiSensors() as TData,
    ...options,
  });
export const useDefaultServiceGetApiUsersByIdSuspense = <
  TData = Common.DefaultServiceGetApiUsersByIdDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    id,
  }: {
    id: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiUsersByIdKeyFn({ id }, queryKey),
    queryFn: () => DefaultService.getApiUsersById({ id }) as TData,
    ...options,
  });
export const useDefaultServiceGetApiUsersByIdWorkingBlockSuspense = <
  TData = Common.DefaultServiceGetApiUsersByIdWorkingBlockDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  {
    id,
  }: {
    id: string;
  },
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiUsersByIdWorkingBlockKeyFn(
      { id },
      queryKey,
    ),
    queryFn: () => DefaultService.getApiUsersByIdWorkingBlock({ id }) as TData,
    ...options,
  });
export const useDefaultServiceGetApiUsersGetAllPublicAndAvailableSuspense = <
  TData = Common.DefaultServiceGetApiUsersGetAllPublicAndAvailableDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey:
      Common.UseDefaultServiceGetApiUsersGetAllPublicAndAvailableKeyFn(
        queryKey,
      ),
    queryFn: () =>
      DefaultService.getApiUsersGetAllPublicAndAvailable() as TData,
    ...options,
  });
export const useDefaultServiceGetApiUsersSuspense = <
  TData = Common.DefaultServiceGetApiUsersDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiUsersKeyFn(queryKey),
    queryFn: () => DefaultService.getApiUsers() as TData,
    ...options,
  });
