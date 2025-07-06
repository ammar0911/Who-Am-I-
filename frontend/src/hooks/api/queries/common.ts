// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseQueryResult } from '@tanstack/react-query';
import {
  DefaultService,
  OfficesService,
  SensorService,
  UsersService,
} from '../requests/services.gen';
export type OfficesServiceGetApiOfficesByOfficeIdDefaultResponse = Awaited<
  ReturnType<typeof OfficesService.getApiOfficesByOfficeId>
>;
export type OfficesServiceGetApiOfficesByOfficeIdQueryResult<
  TData = OfficesServiceGetApiOfficesByOfficeIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useOfficesServiceGetApiOfficesByOfficeIdKey =
  'OfficesServiceGetApiOfficesByOfficeId';
export const UseOfficesServiceGetApiOfficesByOfficeIdKeyFn = (
  {
    officeId,
  }: {
    officeId: string;
  },
  queryKey?: Array<unknown>,
) => [
  useOfficesServiceGetApiOfficesByOfficeIdKey,
  ...(queryKey ?? [{ officeId }]),
];
export type OfficesServiceGetApiOfficesDefaultResponse = Awaited<
  ReturnType<typeof OfficesService.getApiOffices>
>;
export type OfficesServiceGetApiOfficesQueryResult<
  TData = OfficesServiceGetApiOfficesDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useOfficesServiceGetApiOfficesKey = 'OfficesServiceGetApiOffices';
export const UseOfficesServiceGetApiOfficesKeyFn = (
  queryKey?: Array<unknown>,
) => [useOfficesServiceGetApiOfficesKey, ...(queryKey ?? [])];
export type SensorServiceGetApiSensorsByIdDefaultResponse = Awaited<
  ReturnType<typeof SensorService.getApiSensorsById>
>;
export type SensorServiceGetApiSensorsByIdQueryResult<
  TData = SensorServiceGetApiSensorsByIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useSensorServiceGetApiSensorsByIdKey =
  'SensorServiceGetApiSensorsById';
export const UseSensorServiceGetApiSensorsByIdKeyFn = (
  {
    id,
  }: {
    id: string;
  },
  queryKey?: Array<unknown>,
) => [useSensorServiceGetApiSensorsByIdKey, ...(queryKey ?? [{ id }])];
export type SensorServiceGetApiSensorsByOfficeIdDefaultResponse = Awaited<
  ReturnType<typeof SensorService.getApiSensorsByOfficeId>
>;
export type SensorServiceGetApiSensorsByOfficeIdQueryResult<
  TData = SensorServiceGetApiSensorsByOfficeIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useSensorServiceGetApiSensorsByOfficeIdKey =
  'SensorServiceGetApiSensorsByOfficeId';
export const UseSensorServiceGetApiSensorsByOfficeIdKeyFn = (
  {
    officeId,
  }: {
    officeId: string;
  },
  queryKey?: Array<unknown>,
) => [
  useSensorServiceGetApiSensorsByOfficeIdKey,
  ...(queryKey ?? [{ officeId }]),
];
export type SensorServiceGetApiSensorsDefaultResponse = Awaited<
  ReturnType<typeof SensorService.getApiSensors>
>;
export type SensorServiceGetApiSensorsQueryResult<
  TData = SensorServiceGetApiSensorsDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useSensorServiceGetApiSensorsKey = 'SensorServiceGetApiSensors';
export const UseSensorServiceGetApiSensorsKeyFn = (
  queryKey?: Array<unknown>,
) => [useSensorServiceGetApiSensorsKey, ...(queryKey ?? [])];
export type UsersServiceGetApiUsersByIdDefaultResponse = Awaited<
  ReturnType<typeof UsersService.getApiUsersById>
>;
export type UsersServiceGetApiUsersByIdQueryResult<
  TData = UsersServiceGetApiUsersByIdDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useUsersServiceGetApiUsersByIdKey = 'UsersServiceGetApiUsersById';
export const UseUsersServiceGetApiUsersByIdKeyFn = (
  {
    id,
  }: {
    id: string;
  },
  queryKey?: Array<unknown>,
) => [useUsersServiceGetApiUsersByIdKey, ...(queryKey ?? [{ id }])];
export type UsersServiceGetApiUsersGetAllPublicAndAvailableDefaultResponse =
  Awaited<ReturnType<typeof UsersService.getApiUsersGetAllPublicAndAvailable>>;
export type UsersServiceGetApiUsersGetAllPublicAndAvailableQueryResult<
  TData = UsersServiceGetApiUsersGetAllPublicAndAvailableDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useUsersServiceGetApiUsersGetAllPublicAndAvailableKey =
  'UsersServiceGetApiUsersGetAllPublicAndAvailable';
export const UseUsersServiceGetApiUsersGetAllPublicAndAvailableKeyFn = (
  queryKey?: Array<unknown>,
) => [
  useUsersServiceGetApiUsersGetAllPublicAndAvailableKey,
  ...(queryKey ?? []),
];
export type UsersServiceGetApiUsersDefaultResponse = Awaited<
  ReturnType<typeof UsersService.getApiUsers>
>;
export type UsersServiceGetApiUsersQueryResult<
  TData = UsersServiceGetApiUsersDefaultResponse,
  TError = unknown,
> = UseQueryResult<TData, TError>;
export const useUsersServiceGetApiUsersKey = 'UsersServiceGetApiUsers';
export const UseUsersServiceGetApiUsersKeyFn = (queryKey?: Array<unknown>) => [
  useUsersServiceGetApiUsersKey,
  ...(queryKey ?? []),
];
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
export type SensorServicePostApiSensorsByIdMutationResult = Awaited<
  ReturnType<typeof SensorService.postApiSensorsById>
>;
export type OfficesServicePutApiOfficesByOfficeIdMutationResult = Awaited<
  ReturnType<typeof OfficesService.putApiOfficesByOfficeId>
>;
export type UsersServicePutApiUsersByIdMutationResult = Awaited<
  ReturnType<typeof UsersService.putApiUsersById>
>;
