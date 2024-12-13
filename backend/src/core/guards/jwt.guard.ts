import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ROLES_KEY } from "../decorators/roles/roles.decorator";
import { Role } from "../config/role.enum";

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(
        private readonly reflector: Reflector
    ){
        super()
    }
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const requiredRoles= this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) return true;
        
        const canActivate = await super.canActivate(context);
        if (!canActivate) return false;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Access denied: Insufficient permissions');
        }
        return true;
    }
}