export interface AccountsResponse{
    username: string;
    password: string;
    date_created: string;
    role: string;
 }

 export const parseDateTime = (dateString: string): Date => {
    return new Date(dateString);
  }