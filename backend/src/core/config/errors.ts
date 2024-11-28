import { HttpException, HttpStatus, InternalServerErrorException, NotFoundException } from "@nestjs/common";

export const handleError=(error:any)=>{
    if (error.code === '23505')
        throw new HttpException('Existing srCode', HttpStatus.CONFLICT);
    if (error.code === 404)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if(error==404)
      throw new NotFoundException
    else
        throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR); 
}

export const errorCatch=(error:any)=>{
  if (error instanceof HttpException) {
    throw error; // Keeps original exception
  }
  
  // Unexpected errors get converted to 500 Internal Server Error
  throw new InternalServerErrorException('Unexpected error');
}