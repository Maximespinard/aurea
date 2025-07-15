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
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CycleService } from './cycle.service';
import { CreateCycleDto, UpdateCycleDto, CreateDayEntryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Cycles')
@ApiBearerAuth('JWT-auth')
@Controller('cycles')
@UseGuards(JwtAuthGuard)
export class CycleController {
  constructor(
    private readonly cycleService: CycleService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new cycle' })
  @ApiBody({ type: CreateCycleDto })
  @ApiResponse({
    status: 201,
    description: 'Cycle successfully created',
    type: CreateCycleDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error or active cycle exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createCycleDto: CreateCycleDto,
  ) {
    // First, get the user's profile
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.create(profile.id, createCycleDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all cycles for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user cycles',
    type: [CreateCycleDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async findAll(@Request() req: AuthenticatedRequest) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.findAll(profile.id);
  }

  // Predictions Endpoint
  @Get('predictions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get cycle predictions' })
  @ApiResponse({
    status: 200,
    description: 'Cycle predictions',
    schema: {
      example: {
        nextPeriodDate: '2024-02-01',
        nextOvulationDate: '2024-01-15',
        fertileWindowStart: '2024-01-13',
        fertileWindowEnd: '2024-01-19',
        averageCycleLength: 28,
        periodLength: 5,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getPredictions(@Request() req: AuthenticatedRequest) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.calculatePredictions(profile.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get specific cycle by ID' })
  @ApiParam({ name: 'id', description: 'Cycle ID' })
  @ApiResponse({
    status: 200,
    description: 'Cycle found',
    type: CreateCycleDto,
  })
  @ApiResponse({ status: 404, description: 'Cycle or profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.findOne(id, profile.id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a cycle' })
  @ApiParam({ name: 'id', description: 'Cycle ID' })
  @ApiBody({ type: UpdateCycleDto })
  @ApiResponse({
    status: 200,
    description: 'Cycle successfully updated',
    type: UpdateCycleDto,
  })
  @ApiResponse({ status: 404, description: 'Cycle or profile not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateCycleDto: UpdateCycleDto,
  ) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.update(id, profile.id, updateCycleDto);
  }

  @Post('end-active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End the active cycle' })
  @ApiResponse({
    status: 200,
    description: 'Active cycle ended',
    type: UpdateCycleDto,
  })
  @ApiResponse({ status: 400, description: 'No active cycle found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async endActive(@Request() req: AuthenticatedRequest) {
    const profile = await this.getProfile(req.user.sub);
    return this.cycleService.endActiveCycle(profile.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a cycle' })
  @ApiParam({ name: 'id', description: 'Cycle ID' })
  @ApiResponse({ status: 204, description: 'Cycle successfully deleted' })
  @ApiResponse({ status: 404, description: 'Cycle or profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const profile = await this.getProfile(req.user.sub);
    await this.cycleService.remove(id, profile.id);
  }

  // Day Entry Endpoints
  @Post(':cycleId/entries')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create or update a daily entry' })
  @ApiParam({ name: 'cycleId', description: 'Cycle ID' })
  @ApiBody({ type: CreateDayEntryDto })
  @ApiResponse({
    status: 201,
    description: 'Day entry created or updated',
    type: CreateDayEntryDto,
  })
  @ApiResponse({ status: 404, description: 'Cycle or profile not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Delete a daily entry' })
  @ApiParam({ name: 'cycleId', description: 'Cycle ID' })
  @ApiQuery({ name: 'date', description: 'Date of the entry (YYYY-MM-DD)', required: true })
  @ApiResponse({ status: 204, description: 'Day entry successfully deleted' })
  @ApiResponse({ status: 404, description: 'Entry, cycle or profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeDayEntry(
    @Request() req: AuthenticatedRequest,
    @Param('cycleId') cycleId: string,
    @Query('date') date: string,
  ) {
    const profile = await this.getProfile(req.user.sub);
    await this.cycleService.removeDayEntry(cycleId, date, profile.id);
  }

  // Helper method to get profile
  private async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found. Please create a profile first.');
    }

    return profile;
  }
}
