// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseQueryResult } from '@tanstack/react-query';
import { DefaultService } from '../requests/services.gen';
export type DefaultServiceGetApiSensorsByIdDefaultResponse = Awaited<
  ReturnType<typeof DefaultService.getApiSensorsById>
>;
export type DefaultServiceGetApiSensorsByIdQueryResult<
  TData = DefaultServiceGetApiSensorsByIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetApiSensorsByIdKey =
  'DefaultServiceGetApiSensorsById';
export const UseDefaultServiceGetApiSensorsByIdKeyFn = (
  {
    id,
  }: {
    id: string;
  },
  queryKey?: Array<unknown>,
) => [useDefaultServiceGetApiSensorsByIdKey, ...(queryKey ?? [{ id }])];
export type DefaultServiceGetApiSensorsByOfficeIdDefaultResponse = Awaited<
  ReturnType<typeof DefaultService.getApiSensorsByOfficeId>
>;
export type DefaultServiceGetApiSensorsByOfficeIdQueryResult<
  TData = DefaultServiceGetApiSensorsByOfficeIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetApiSensorsByOfficeIdKey =
  'DefaultServiceGetApiSensorsByOfficeId';
export const UseDefaultServiceGetApiSensorsByOfficeIdKeyFn = (
  {
    officeId,
  }: {
    officeId: string;
  },
  queryKey?: Array<unknown>,
) => [
  useDefaultServiceGetApiSensorsByOfficeIdKey,
  ...(queryKey ?? [{ officeId }]),
];
export type DefaultServiceGetApiSensorsDefaultResponse = Awaited<
  ReturnType<typeof DefaultService.getApiSensors>
>;
export type DefaultServiceGetApiSensorsQueryResult<
  TData = DefaultServiceGetApiSensorsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetApiSensorsKey = 'DefaultServiceGetApiSensors';
export const UseDefaultServiceGetApiSensorsKeyFn = (
  queryKey?: Array<unknown>,
) => [useDefaultServiceGetApiSensorsKey, ...(queryKey ?? [])];
export type DefaultServiceGetApiUsersByIdDefaultResponse = Awaited<
  ReturnType<typeof DefaultService.getApiUsersById>
>;
export type DefaultServiceGetApiUsersByIdQueryResult<
  TData = DefaultServiceGetApiUsersByIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetApiUsersByIdKey =
  'DefaultServiceGetApiUsersById';
export const UseDefaultServiceGetApiUsersByIdKeyFn = (
  {
    id,
  }: {
    id: string;
  },
  queryKey?: Array<unknown>,
) => [useDefaultServiceGetApiUsersByIdKey, ...(queryKey ?? [{ id }])];
export type DefaultServiceGetApiUsersByIdWorkingBlockDefaultResponse = Awaited<
  ReturnType<typeof DefaultService.getApiUsersByIdWorkingBlock>
>;
export type DefaultServiceGetApiUsersByIdWorkingBlockQueryResult<
  TData = DefaultServiceGetApiUsersByIdWorkingBlockDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetApiUsersByIdWorkingBlockKey =
  'DefaultServiceGetApiUsersByIdWorkingBlock';
export const UseDefaultServiceGetApiUsersByIdWorkingBlockKeyFn = (
  {
    id,
  }: {
    id: string;
  },
  queryKey?: Array<unknown>,
) => [
  useDefaultServiceGetApiUsersByIdWorkingBlockKey,
  ...(queryKey ?? [{ id }]),
];
export type DefaultServiceGetApiUsersGetAllPublicAndAvailableDefaultResponse =
  Awaited<
    ReturnType<typeof DefaultService.getApiUsersGetAllPublicAndAvailable>
  >;
export type DefaultServiceGetApiUsersGetAllPublicAndAvailableQueryResult<
  TData = DefaultServiceGetApiUsersGetAllPublicAndAvailableDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetApiUsersGetAllPublicAndAvailableKey =
  'DefaultServiceGetApiUsersGetAllPublicAndAvailable';
export const UseDefaultServiceGetApiUsersGetAllPublicAndAvailableKeyFn = (
  queryKey?: Array<unknown>,
) => [
  useDefaultServiceGetApiUsersGetAllPublicAndAvailableKey,
  ...(queryKey ?? []),
];
export type DefaultServiceGetApiUsersDefaultResponse = Awaited<
  ReturnType<typeof DefaultService.getApiUsers>
>;
export type DefaultServiceGetApiUsersQueryResult<
  TData = DefaultServiceGetApiUsersDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetApiUsersKey = 'DefaultServiceGetApiUsers';
export const UseDefaultServiceGetApiUsersKeyFn = (
  queryKey?: Array<unknown>,
) => [useDefaultServiceGetApiUsersKey, ...(queryKey ?? [])];
export type DefaultServicePutApiSensorsByIdMutationResult = Awaited<
  ReturnType<typeof DefaultService.putApiSensorsById>
>;
export type DefaultServicePutApiUsersByIdMutationResult = Awaited<
  ReturnType<typeof DefaultService.putApiUsersById>
>;
