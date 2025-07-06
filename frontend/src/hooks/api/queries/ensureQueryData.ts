// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { type QueryClient } from '@tanstack/react-query';
import {
  DefaultService,
  OfficesService,
  SensorService,
  UsersService,
} from '../requests/services.gen';
import * as Common from './common';
export const ensureUseOfficesServiceGetApiOfficesByOfficeIdData = (
  queryClient: QueryClient,
  {
    officeId,
  }: {
    officeId: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseOfficesServiceGetApiOfficesByOfficeIdKeyFn({
      officeId,
    }),
    queryFn: () => OfficesService.getApiOfficesByOfficeId({ officeId }),
  });
export const ensureUseOfficesServiceGetApiOfficesData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseOfficesServiceGetApiOfficesKeyFn(),
    queryFn: () => OfficesService.getApiOffices(),
  });
export const ensureUseSensorServiceGetApiSensorsByIdData = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseSensorServiceGetApiSensorsByIdKeyFn({ id }),
    queryFn: () => SensorService.getApiSensorsById({ id }),
  });
export const ensureUseSensorServiceGetApiSensorsByOfficeIdData = (
  queryClient: QueryClient,
  {
    officeId,
  }: {
    officeId: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseSensorServiceGetApiSensorsByOfficeIdKeyFn({ officeId }),
    queryFn: () => SensorService.getApiSensorsByOfficeId({ officeId }),
  });
export const ensureUseSensorServiceGetApiSensorsData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseSensorServiceGetApiSensorsKeyFn(),
    queryFn: () => SensorService.getApiSensors(),
  });
export const ensureUseUsersServiceGetApiUsersByIdData = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseUsersServiceGetApiUsersByIdKeyFn({ id }),
    queryFn: () => UsersService.getApiUsersById({ id }),
  });
export const ensureUseUsersServiceGetApiUsersGetAllPublicAndAvailableData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseUsersServiceGetApiUsersGetAllPublicAndAvailableKeyFn(),
    queryFn: () => UsersService.getApiUsersGetAllPublicAndAvailable(),
  });
export const ensureUseUsersServiceGetApiUsersData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseUsersServiceGetApiUsersKeyFn(),
    queryFn: () => UsersService.getApiUsers(),
  });
export const ensureUseDefaultServiceGetApiUsersByIdWorkingBlockData = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseDefaultServiceGetApiUsersByIdWorkingBlockKeyFn({ id }),
    queryFn: () => DefaultService.getApiUsersByIdWorkingBlock({ id }),
  });
