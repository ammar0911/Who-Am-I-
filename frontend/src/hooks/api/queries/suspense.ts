// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseQueryOptions, useSuspenseQuery } from '@tanstack/react-query';
import {
  OfficesService,
  SensorService,
  UsersService,
} from '../requests/services.gen';
import * as Common from './common';
export const useOfficesServiceGetApiOfficesByOfficeIdSuspense = <
  TData = Common.OfficesServiceGetApiOfficesByOfficeIdDefaultResponse,
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
    queryKey: Common.UseOfficesServiceGetApiOfficesByOfficeIdKeyFn(
      { officeId },
      queryKey,
    ),
    queryFn: () =>
      OfficesService.getApiOfficesByOfficeId({ officeId }) as TData,
    ...options,
  });
export const useOfficesServiceGetApiOfficesSuspense = <
  TData = Common.OfficesServiceGetApiOfficesDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseOfficesServiceGetApiOfficesKeyFn(queryKey),
    queryFn: () => OfficesService.getApiOffices() as TData,
    ...options,
  });
export const useSensorServiceGetApiSensorsByIdSuspense = <
  TData = Common.SensorServiceGetApiSensorsByIdDefaultResponse,
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
    queryKey: Common.UseSensorServiceGetApiSensorsByIdKeyFn({ id }, queryKey),
    queryFn: () => SensorService.getApiSensorsById({ id }) as TData,
    ...options,
  });
export const useSensorServiceGetApiSensorsByOfficeIdSuspense = <
  TData = Common.SensorServiceGetApiSensorsByOfficeIdDefaultResponse,
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
    queryKey: Common.UseSensorServiceGetApiSensorsByOfficeIdKeyFn(
      { officeId },
      queryKey,
    ),
    queryFn: () => SensorService.getApiSensorsByOfficeId({ officeId }) as TData,
    ...options,
  });
export const useSensorServiceGetApiSensorsSuspense = <
  TData = Common.SensorServiceGetApiSensorsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseSensorServiceGetApiSensorsKeyFn(queryKey),
    queryFn: () => SensorService.getApiSensors() as TData,
    ...options,
  });
export const useUsersServiceGetApiUsersByIdSuspense = <
  TData = Common.UsersServiceGetApiUsersByIdDefaultResponse,
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
    queryKey: Common.UseUsersServiceGetApiUsersByIdKeyFn({ id }, queryKey),
    queryFn: () => UsersService.getApiUsersById({ id }) as TData,
    ...options,
  });
export const useUsersServiceGetApiUsersByIdWorkingBlockSuspense = <
  TData = Common.UsersServiceGetApiUsersByIdWorkingBlockDefaultResponse,
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
    queryKey: Common.UseUsersServiceGetApiUsersByIdWorkingBlockKeyFn(
      { id },
      queryKey,
    ),
    queryFn: () => UsersService.getApiUsersByIdWorkingBlock({ id }) as TData,
    ...options,
  });
export const useUsersServiceGetApiUsersGetAllPublicAndAvailableSuspense = <
  TData = Common.UsersServiceGetApiUsersGetAllPublicAndAvailableDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey:
      Common.UseUsersServiceGetApiUsersGetAllPublicAndAvailableKeyFn(queryKey),
    queryFn: () => UsersService.getApiUsersGetAllPublicAndAvailable() as TData,
    ...options,
  });
export const useUsersServiceGetApiUsersSuspense = <
  TData = Common.UsersServiceGetApiUsersDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useSuspenseQuery<TData, TError>({
    queryKey: Common.UseUsersServiceGetApiUsersKeyFn(queryKey),
    queryFn: () => UsersService.getApiUsers() as TData,
    ...options,
  });
