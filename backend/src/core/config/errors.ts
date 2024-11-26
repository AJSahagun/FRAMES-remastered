import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";

export const handleError=(error:any)=>{
    if (error.code === '23505')
        throw new HttpException('Existing srCode', HttpStatus.CONFLICT);
    if(error==404)
      throw new NotFoundException
    else
        throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR); 
}