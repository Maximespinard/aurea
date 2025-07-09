import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const userId = req.user.sub;
    return this.profileService.create(userId, createProfileDto);
  }

  @Get()
  async findOne(@Request() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.profileService.findByUserId(userId);
  }

  @Put()
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.sub;
    return this.profileService.update(userId, updateProfileDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.profileService.remove(userId);
  }

  @Get('exists')
  async checkExists(@Request() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    const exists = await this.profileService.checkProfileExists(userId);
    return { exists };
  }
}
