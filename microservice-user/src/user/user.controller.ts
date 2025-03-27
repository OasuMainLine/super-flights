import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UserMessages } from 'src/common/constants';
import {
  IValidateUserPayload,
  IUpdateUserPayload,
} from 'src/common/payloads/payloads';
import { IUser } from 'src/common/interfaces/user.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserMessages.CREATE)
  create(@Payload() userDTO: UserDTO) {
    return this.userService.create(userDTO);
  }

  @MessagePattern(UserMessages.FIND_ALL)
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern(UserMessages.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern(UserMessages.UPDATE)
  update(@Payload() payload: IUpdateUserPayload) {
    return this.userService.update(payload.id, payload.user);
  }

  @MessagePattern(UserMessages.DELETE)
  delete(@Payload() id: string) {
    return this.userService.delete(id);
  }

  @MessagePattern(UserMessages.VALID_USER)
  async validateUser(
    @Payload() payload: IValidateUserPayload,
  ): Promise<null | IUser> {
    const user = await this.userService.findByUsername(payload.username);

    if (!user) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `User not find. Verify credentials`,
      });
    }
    const isValidPassword = await this.userService.checkPassword(
      payload.password,
      user.password,
    );

    if (user && isValidPassword) return user;

    return null;
  }
}
