import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.userService.create(registerDto);
      const payload = {
        sub: user.id,
        email: user.email,
        username: user.username,
      };

      return {
        user,
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      // Log the actual error for debugging but don't expose details
      console.error('Registration error:', error);
      throw new UnauthorizedException('Registration failed');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        username: user.username,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      // Log failed login attempts for security monitoring
      console.error('Login attempt failed:', {
        email: loginDto.email,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);

      // Always perform bcrypt comparison to prevent timing attacks
      const isValid = user
        ? await bcrypt.compare(password, user.password)
        : await bcrypt.compare(
            password,
            '$2b$10$dummy.hash.to.prevent.timing.attacks',
          ); // Dummy hash to maintain consistent timing

      if (user && isValid) {
        return user;
      }

      return null;
    } catch (error) {
      console.error('User validation error:', error);
      return null;
    }
  }

  async validateUserById(id: string) {
    return await this.userService.findById(id);
  }
}
