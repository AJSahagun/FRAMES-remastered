import { TermsOfService } from '../types/terms.types';
import { apiClient } from './api.service';

class TermsService {
  private readonly BASE_PATH = '/terms';

  async getTermsOfService(): Promise<TermsOfService> {
    const response = await apiClient.get<TermsOfService>(`${this.BASE_PATH}`);
    return response.data;
  }
}

export const termsService = new TermsService();