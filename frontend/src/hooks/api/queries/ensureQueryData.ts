// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { type QueryClient } from '@tanstack/react-query';
import { DefaultService } from '../requests/services.gen';
import * as Common from './common';
export const ensureUseDefaultServiceGetApiSensorsByIdData = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseDefaultServiceGetApiSensorsByIdKeyFn({ id }),
    queryFn: () => DefaultService.getApiSensorsById({ id }),
  });
export const ensureUseDefaultServiceGetApiSensorsByOfficeIdData = (
  queryClient: QueryClient,
  {
    officeId,
  }: {
    officeId: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseDefaultServiceGetApiSensorsByOfficeIdKeyFn({
      officeId,
    }),
    queryFn: () => DefaultService.getApiSensorsByOfficeId({ officeId }),
  });
export const ensureUseDefaultServiceGetApiSensorsData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseDefaultServiceGetApiSensorsKeyFn(),
    queryFn: () => DefaultService.getApiSensors(),
  });
export const ensureUseDefaultServiceGetApiUsersByIdData = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseDefaultServiceGetApiUsersByIdKeyFn({ id }),
    queryFn: () => DefaultService.getApiUsersById({ id }),
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
export const ensureUseDefaultServiceGetApiUsersGetAllPublicAndAvailableData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey:
      Common.UseDefaultServiceGetApiUsersGetAllPublicAndAvailableKeyFn(),
    queryFn: () => DefaultService.getApiUsersGetAllPublicAndAvailable(),
  });
export const ensureUseDefaultServiceGetApiUsersData = (
  queryClient: QueryClient,
) =>
  queryClient.ensureQueryData({
    queryKey: Common.UseDefaultServiceGetApiUsersKeyFn(),
    queryFn: () => DefaultService.getApiUsers(),
  });
