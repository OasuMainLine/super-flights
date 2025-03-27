import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ClientProxySuperFlights } from 'common/proxy/client.proxy';
import { UpdateUserDTO, UserDTO } from './dto/user.dto';
import { Observable } from 'rxjs';
import { IUser } from 'common/interfaces/user.interface';
import { UserMessages } from 'common/constants';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { ValidateEmptyPipe } from 'common/pipes/validate-empty.pipe';

@ApiTags('user')
@Controller('api/v2/user')
export class UserController {
  private _clientProxyUser: ClientProxy;
  constructor(private readonly clientProxy: ClientProxySuperFlights) {
    this._clientProxyUser = clientProxy.clientProxyUsers();
  }

  @Post()
  create(@Body() userDTO: UserDTO): Observable<IUser> {
    return this._clientProxyUser.send(UserMessages.CREATE, userDTO);
  }

  @Get()
  findAll(): Observable<IUser[]> {
    return this._clientProxyUser.send(UserMessages.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IUser> {
    return this._clientProxyUser.send(UserMessages.FIND_ONE, id);
  }

  @Put(':id')
  @ApiBadRequestResponse({
    description: 'Body cannot be an empty object',
  })
  @UsePipes(new ValidateEmptyPipe())
  update(
    @Param('id') id: string,
    @Body() userDto: UpdateUserDTO,
  ): Observable<IUser> {
    return this._clientProxyUser.send(UserMessages.UPDATE, {
      id,
      user: userDto,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<any> {
    return this._clientProxyUser.send(UserMessages.DELETE, id);
  }
}
