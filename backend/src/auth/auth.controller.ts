import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  
  @Post('login')
  @Throttle({default: {limit: 5, ttl: 60}})
  async login(@Body() { email, password }: { email: string; password: string }) {
    return this.authService.login(email, password);
  }
}