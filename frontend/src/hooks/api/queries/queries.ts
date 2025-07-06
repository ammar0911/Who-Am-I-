// generated with @7nohe/openapi-react-query-codegen@1.6.2

import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  DefaultService,
  OfficesService,
  SensorService,
  UsersService,
} from '../requests/services.gen';
import { OfficeDTO, SensorInputDTO } from '../requests/types.gen';
import * as Common from './common';
export const useOfficesServiceGetApiOfficesByOfficeId = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseOfficesServiceGetApiOfficesByOfficeIdKeyFn(
      { officeId },
      queryKey,
    ),
    queryFn: () =>
      OfficesService.getApiOfficesByOfficeId({ officeId }) as TData,
    ...options,
  });
export const useOfficesServiceGetApiOffices = <
  TData = Common.OfficesServiceGetApiOfficesDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseOfficesServiceGetApiOfficesKeyFn(queryKey),
    queryFn: () => OfficesService.getApiOffices() as TData,
    ...options,
  });
export const useSensorServiceGetApiSensorsById = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseSensorServiceGetApiSensorsByIdKeyFn({ id }, queryKey),
    queryFn: () => SensorService.getApiSensorsById({ id }) as TData,
    ...options,
  });
export const useSensorServiceGetApiSensorsByOfficeId = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseSensorServiceGetApiSensorsByOfficeIdKeyFn(
      { officeId },
      queryKey,
    ),
    queryFn: () => SensorService.getApiSensorsByOfficeId({ officeId }) as TData,
    ...options,
  });
export const useSensorServiceGetApiSensors = <
  TData = Common.SensorServiceGetApiSensorsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseSensorServiceGetApiSensorsKeyFn(queryKey),
    queryFn: () => SensorService.getApiSensors() as TData,
    ...options,
  });
export const useUsersServiceGetApiUsersById = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseUsersServiceGetApiUsersByIdKeyFn({ id }, queryKey),
    queryFn: () => UsersService.getApiUsersById({ id }) as TData,
    ...options,
  });
export const useUsersServiceGetApiUsersGetAllPublicAndAvailable = <
  TData = Common.UsersServiceGetApiUsersGetAllPublicAndAvailableDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey:
      Common.UseUsersServiceGetApiUsersGetAllPublicAndAvailableKeyFn(queryKey),
    queryFn: () => UsersService.getApiUsersGetAllPublicAndAvailable() as TData,
    ...options,
  });
export const useUsersServiceGetApiUsers = <
  TData = Common.UsersServiceGetApiUsersDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseUsersServiceGetApiUsersKeyFn(queryKey),
    queryFn: () => UsersService.getApiUsers() as TData,
    ...options,
  });
export const useDefaultServiceGetApiUsersByIdWorkingBlock = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiUsersByIdWorkingBlockKeyFn(
      { id },
      queryKey,
    ),
    queryFn: () => DefaultService.getApiUsersByIdWorkingBlock({ id }) as TData,
    ...options,
  });
export const useSensorServicePostApiSensorsById = <
  TData = Common.SensorServicePostApiSensorsByIdMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        id: string;
        requestBody: SensorInputDTO;
      },
      TContext
    >,
    'mutationFn'
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      id: string;
      requestBody: SensorInputDTO;
    },
    TContext
  >({
    mutationFn: ({ id, requestBody }) =>
      SensorService.postApiSensorsById({
        id,
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useOfficesServicePutApiOfficesByOfficeId = <
  TData = Common.OfficesServicePutApiOfficesByOfficeIdMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        officeId: string;
        requestBody: OfficeDTO;
      },
      TContext
    >,
    'mutationFn'
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      officeId: string;
      requestBody: OfficeDTO;
    },
    TContext
  >({
    mutationFn: ({ officeId, requestBody }) =>
      OfficesService.putApiOfficesByOfficeId({
        officeId,
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useUsersServicePutApiUsersById = <
  TData = Common.UsersServicePutApiUsersByIdMutationResult,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<
      TData,
      TError,
      {
        id: string;
        requestBody: { [key: string]: unknown };
      },
      TContext
    >,
    'mutationFn'
  >,
) =>
  useMutation<
    TData,
    TError,
    {
      id: string;
      requestBody: { [key: string]: unknown };
    },
    TContext
  >({
    mutationFn: ({ id, requestBody }) =>
      UsersService.putApiUsersById({
        id,
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
