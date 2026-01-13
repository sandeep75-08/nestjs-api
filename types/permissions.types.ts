export type PermissionAction = 'read' | 'write' | 'update' | 'delete';

export type ModulePermissions = {
  roleId: number;
  canDelete: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canWrite: boolean;
};

export type RolePermissions = {
  moduleId: number;
  canDelete: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canWrite: boolean;
};
