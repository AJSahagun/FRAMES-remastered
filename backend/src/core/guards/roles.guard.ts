import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../config/role.enum';
import { ROLES_KEY } from '../decorators/roles/roles.decorator';
import { ApiKeyService } from '../services/api-key/api-key.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly reflector:Reflector
  ) {}

 
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles= this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    const request= context.switchToHttp().getRequest()
    const apiKey=request.headers['x-api-key']

    if(!apiKey){
      throw new UnauthorizedException('API key is missing')
    }
    const role= await this.apiKeyService.isApiKeyValid(apiKey)

    if(roles && roles.length > 0 && !roles.includes(role as Role)){
      throw new UnauthorizedException('Access is denied')
    }
    return true
  }

}
