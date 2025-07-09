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
} from '@nestjs/common';
import { CycleService } from './cycle.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces';

@Controller('cycles')
@UseGuards(JwtAuthGuard)
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  // TODO: Implement endpoints
}