import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CycleService {
  constructor(private prisma: PrismaService) {}

  // TODO: Implement CRUD operations
}