import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { UserMessages } from 'common/constants';
import { IUser } from 'common/interfaces/user.interface';
import { ClientProxySuperFlights } from 'common/proxy/client.proxy';
import { firstValueFrom } from 'rxjs';
import { UserDTO } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  private _clientProxyUser: ClientProxy;
  constructor(
    private readonly clientProxy: ClientProxySuperFlights,
    private readonly jwtService: JwtService,
  ) {
    this._clientProxyUser = clientProxy.clientProxyUsers();
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<IUser | null> {
    try {
      const user = await firstValueFrom(
        this._clientProxyUser.send<IUser | null>(UserMessages.VALID_USER, {
          username,
          password,
        }),
      );

      return user;
    } catch {
      return null;
    }
  }
  async signIn(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(userDTO: UserDTO): Promise<IUser> {
    return await firstValueFrom(
      this._clientProxyUser.send<IUser>(UserMessages.CREATE, userDTO),
    );
  }
}
