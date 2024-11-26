import { HttpException, HttpStatus } from "@nestjs/common";

export const handleError=(error:any)=>{
    if (error.code === '23505')
        throw new HttpException('Existing srCode', HttpStatus.CONFLICT);
    if (error.code === 404)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if(error==404)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    else
        throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR); 
}