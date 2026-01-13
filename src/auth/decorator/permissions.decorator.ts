import { SetMetadata } from '@nestjs/common';
import { PermissionAction } from 'types';

export const PERMISSION_KEY = 'permission';

export const RequirePermission = (module: string, action: PermissionAction) =>
  SetMetadata(PERMISSION_KEY, { module, action });
