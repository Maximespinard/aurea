import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CycleService } from './cycle.service';
import { CreateCycleDto, UpdateCycleDto, CreateDayEntryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Controller('cycles')
@UseGuards(JwtAuthGuard)
export class CycleController {
  constructor(
    private readonly cycleService: CycleService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createCycleDto: CreateCycleDto,
  ) {
    // First, get the user's profile
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.create(profile.id, createCycleDto);
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.findAll(profile.id);
  }

  @Get(':id')
  async findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.findOne(id, profile.id);
  }

  @Put(':id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateCycleDto: UpdateCycleDto,
  ) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.update(id, profile.id, updateCycleDto);
  }

  @Post('end-active')
  async endActive(@Request() req: AuthenticatedRequest) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.endActiveCycle(profile.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const profile = await this.getProfile(req.user.sub);
    await this.cycleService.remove(id, profile.id);
  }

  // Day Entry Endpoints
  @Post(':cycleId/entries')
  @HttpCode(HttpStatus.CREATED)
  async createDayEntry(
    @Request() req: AuthenticatedRequest,
    @Param('cycleId') cycleId: string,
    @Body() createDayEntryDto: CreateDayEntryDto,
  ) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.createOrUpdateDayEntry(
      cycleId,
      profile.id,
      createDayEntryDto,
    );
  }

  @Delete(':cycleId/entries')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeDayEntry(
    @Request() req: AuthenticatedRequest,
    @Param('cycleId') cycleId: string,
    @Query('date') date: string,
  ) {
    const profile = await this.getProfile(req.user.sub);
    await this.cycleService.removeDayEntry(cycleId, date, profile.id);
  }

  // Predictions Endpoint
  @Get('predictions')
  async getPredictions(@Request() req: AuthenticatedRequest) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.calculatePredictions(profile.id);
  }

  // Helper method to get profile
  private async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Profile not found. Please create a profile first.');
    }

    return profile;
  }
}
