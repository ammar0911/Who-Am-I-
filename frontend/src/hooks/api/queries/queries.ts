// generated with @7nohe/openapi-react-query-codegen@1.6.2

import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { DefaultService, OfficeService } from '../requests/services.gen';
import { OfficeDTO, SensorInputDTO } from '../requests/types.gen';
import * as Common from './common';
export const useOfficeServiceGetApiOffice = <
  TData = Common.OfficeServiceGetApiOfficeDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseOfficeServiceGetApiOfficeKeyFn(queryKey),
    queryFn: () => OfficeService.getApiOffice() as TData,
    ...options,
  });
export const useDefaultServiceGetApiSensorsById = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiSensorsByIdKeyFn({ id }, queryKey),
    queryFn: () => DefaultService.getApiSensorsById({ id }) as TData,
    ...options,
  });
export const useDefaultServiceGetApiSensorsByOfficeId = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiSensorsByOfficeIdKeyFn(
      { officeId },
      queryKey,
    ),
    queryFn: () =>
      DefaultService.getApiSensorsByOfficeId({ officeId }) as TData,
    ...options,
  });
export const useDefaultServiceGetApiSensors = <
  TData = Common.DefaultServiceGetApiSensorsDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiSensorsKeyFn(queryKey),
    queryFn: () => DefaultService.getApiSensors() as TData,
    ...options,
  });
export const useDefaultServiceGetApiUsersById = <
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
  useQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiUsersByIdKeyFn({ id }, queryKey),
    queryFn: () => DefaultService.getApiUsersById({ id }) as TData,
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
export const useDefaultServiceGetApiUsersGetAllPublicAndAvailable = <
  TData = Common.DefaultServiceGetApiUsersGetAllPublicAndAvailableDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey:
      Common.UseDefaultServiceGetApiUsersGetAllPublicAndAvailableKeyFn(
        queryKey,
      ),
    queryFn: () =>
      DefaultService.getApiUsersGetAllPublicAndAvailable() as TData,
    ...options,
  });
export const useDefaultServiceGetApiUsers = <
  TData = Common.DefaultServiceGetApiUsersDefaultResponse,
  TError = unknown,
  TQueryKey extends Array<unknown> = unknown[],
>(
  queryKey?: TQueryKey,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) =>
  useQuery<TData, TError>({
    queryKey: Common.UseDefaultServiceGetApiUsersKeyFn(queryKey),
    queryFn: () => DefaultService.getApiUsers() as TData,
    ...options,
  });
export const useDefaultServicePostApiSensorsById = <
  TData = Common.DefaultServicePostApiSensorsByIdMutationResult,
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
      DefaultService.postApiSensorsById({
        id,
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useOfficeServicePutApiOfficeByOfficeId = <
  TData = Common.OfficeServicePutApiOfficeByOfficeIdMutationResult,
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
      OfficeService.putApiOfficeByOfficeId({
        officeId,
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
export const useDefaultServicePutApiUsersById = <
  TData = Common.DefaultServicePutApiUsersByIdMutationResult,
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
      DefaultService.putApiUsersById({
        id,
        requestBody,
      }) as unknown as Promise<TData>,
    ...options,
  });
