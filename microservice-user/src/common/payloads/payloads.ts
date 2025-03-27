import { UpdateUserDTO } from 'src/user/dto/user.dto';

export type IUpdateUserPayload = {
  id: string;
  user: UpdateUserDTO;
};
export type IValidateUserPayload = {
  username: string;
  password: string;
};
