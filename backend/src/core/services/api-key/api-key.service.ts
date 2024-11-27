import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Module,
} from '@nestjs/common';

@Injectable()
export class ApiKeyService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async isApiKeyValid(key: string) {
    try {
      const data = await this.sql(
        `select * from keys where key='${key}' and active`,
      );
      return data[0].role
    } catch (error) {
      new InternalServerErrorException('Server error');
    }
  }
}
