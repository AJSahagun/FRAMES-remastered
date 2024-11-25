import { Reflector } from "@nestjs/core"
import { ApiKeyService } from "../services/api-key/api-key.service"
import { RolesGuard } from "./roles.guard"
import { ExecutionContext } from "@nestjs/common"

describe('RolesGuard', ()=>{
    let guard:RolesGuard
    let apiKeyService:ApiKeyService
    let reflector:Reflector
    
    const adminKey="someAdminKey"
    const devKey="someDevKey"
    const anonKey="someAnonKey"

    beforeEach(()=>{
        apiKeyService = { isApiKeyValid: jest.fn() } as any;
        reflector = { get: jest.fn() } as any;
        guard = new RolesGuard(apiKeyService, reflector);

    })

    it('should allow access if the API key is valid and the role matches', async () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-api-key': 'valid-api-key',
            },
          }),
        }),
        getHandler: () => {},
      } as unknown as ExecutionContext;
  
      // Mocking the roles metadata and API key validation response
      (apiKeyService.isApiKeyValid as jest.Mock).mockResolvedValue('admin');
  
      const result = await guard.canActivate(mockExecutionContext);
  
      expect(result).toBe(true);
    });
    
})