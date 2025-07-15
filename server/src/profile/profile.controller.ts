import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces';

@ApiTags('Profile')
@ApiBearerAuth('JWT-auth')
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user profile' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({
    status: 201,
    description: 'Profile successfully created',
    type: CreateProfileDto,
  })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    const userId = req.user.sub;
    return this.profileService.create(userId, createProfileDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile found',
    type: CreateProfileDto,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Request() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.profileService.findByUserId(userId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile successfully updated',
    type: UpdateProfileDto,
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.sub;
    return this.profileService.update(userId, updateProfileDto);
  }

  @Get('exists')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if user profile exists' })
  @ApiResponse({
    status: 200,
    description: 'Profile existence check result',
    schema: {
      example: { exists: true },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async checkExists(@Request() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    const exists = await this.profileService.checkProfileExists(userId);
    return { exists };
  }
}
