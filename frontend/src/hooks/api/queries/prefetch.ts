// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { type QueryClient } from '@tanstack/react-query';
import {
  OfficesService,
  SensorService,
  UsersService,
} from '../requests/services.gen';
import * as Common from './common';
export const prefetchUseOfficesServiceGetApiOfficesByOfficeId = (
  queryClient: QueryClient,
  {
    officeId,
  }: {
    officeId: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseOfficesServiceGetApiOfficesByOfficeIdKeyFn({
      officeId,
    }),
    queryFn: () => OfficesService.getApiOfficesByOfficeId({ officeId }),
  });
export const prefetchUseOfficesServiceGetApiOffices = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseOfficesServiceGetApiOfficesKeyFn(),
    queryFn: () => OfficesService.getApiOffices(),
  });
export const prefetchUseSensorServiceGetApiSensorsById = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseSensorServiceGetApiSensorsByIdKeyFn({ id }),
    queryFn: () => SensorService.getApiSensorsById({ id }),
  });
export const prefetchUseSensorServiceGetApiSensorsByOfficeId = (
  queryClient: QueryClient,
  {
    officeId,
  }: {
    officeId: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseSensorServiceGetApiSensorsByOfficeIdKeyFn({ officeId }),
    queryFn: () => SensorService.getApiSensorsByOfficeId({ officeId }),
  });
export const prefetchUseSensorServiceGetApiSensors = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseSensorServiceGetApiSensorsKeyFn(),
    queryFn: () => SensorService.getApiSensors(),
  });
export const prefetchUseUsersServiceGetApiUsersById = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUsersServiceGetApiUsersByIdKeyFn({ id }),
    queryFn: () => UsersService.getApiUsersById({ id }),
  });
export const prefetchUseUsersServiceGetApiUsersByIdWorkingBlock = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUsersServiceGetApiUsersByIdWorkingBlockKeyFn({ id }),
    queryFn: () => UsersService.getApiUsersByIdWorkingBlock({ id }),
  });
export const prefetchUseUsersServiceGetApiUsersGetAllPublicAndAvailable = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUsersServiceGetApiUsersGetAllPublicAndAvailableKeyFn(),
    queryFn: () => UsersService.getApiUsersGetAllPublicAndAvailable(),
  });
export const prefetchUseUsersServiceGetApiUsers = (queryClient: QueryClient) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseUsersServiceGetApiUsersKeyFn(),
    queryFn: () => UsersService.getApiUsers(),
  });
