// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { type QueryClient } from '@tanstack/react-query';
import { DefaultService } from '../requests/services.gen';
import * as Common from './common';
export const prefetchUseDefaultServiceGetApiSensorsById = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseDefaultServiceGetApiSensorsByIdKeyFn({ id }),
    queryFn: () => DefaultService.getApiSensorsById({ id }),
  });
export const prefetchUseDefaultServiceGetApiSensorsByOfficeId = (
  queryClient: QueryClient,
  {
    officeId,
  }: {
    officeId: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseDefaultServiceGetApiSensorsByOfficeIdKeyFn({
      officeId,
    }),
    queryFn: () => DefaultService.getApiSensorsByOfficeId({ officeId }),
  });
export const prefetchUseDefaultServiceGetApiSensors = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseDefaultServiceGetApiSensorsKeyFn(),
    queryFn: () => DefaultService.getApiSensors(),
  });
export const prefetchUseDefaultServiceGetApiUsersById = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseDefaultServiceGetApiUsersByIdKeyFn({ id }),
    queryFn: () => DefaultService.getApiUsersById({ id }),
  });
export const prefetchUseDefaultServiceGetApiUsersByIdWorkingBlock = (
  queryClient: QueryClient,
  {
    id,
  }: {
    id: string;
  },
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseDefaultServiceGetApiUsersByIdWorkingBlockKeyFn({ id }),
    queryFn: () => DefaultService.getApiUsersByIdWorkingBlock({ id }),
  });
export const prefetchUseDefaultServiceGetApiUsersGetAllPublicAndAvailable = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey:
      Common.UseDefaultServiceGetApiUsersGetAllPublicAndAvailableKeyFn(),
    queryFn: () => DefaultService.getApiUsersGetAllPublicAndAvailable(),
  });
export const prefetchUseDefaultServiceGetApiUsers = (
  queryClient: QueryClient,
) =>
  queryClient.prefetchQuery({
    queryKey: Common.UseDefaultServiceGetApiUsersKeyFn(),
    queryFn: () => DefaultService.getApiUsers(),
  });
