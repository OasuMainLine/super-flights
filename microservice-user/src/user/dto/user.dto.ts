import { PartialType } from '@nestjs/mapped-types';

export class UserDTO {
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
}

export class UpdateUserDTO extends PartialType(UserDTO) {}
