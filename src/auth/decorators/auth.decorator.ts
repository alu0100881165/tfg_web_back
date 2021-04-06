import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from 'src/types/auth.types';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const METADATA_ROLE = 'requiredRoles';

export function Auth(...roles: Role[]) {
	// return applyDecorators(UseGuards(AuthGuard));
	return applyDecorators(SetMetadata(METADATA_ROLE, roles), UseGuards(AuthGuard, RolesGuard));
}
