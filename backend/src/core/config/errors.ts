import { HttpException, HttpStatus } from "@nestjs/common";

export const handleError=(error:any)=>{
    if (error.code === '23505')
        throw new HttpException('Existing srCode', HttpStatus.CONFLICT);
      else
        throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR); 
}