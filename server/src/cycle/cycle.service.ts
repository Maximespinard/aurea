import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCycleDto, UpdateCycleDto, CreateDayEntryDto } from './dto';
import type { Prisma } from '@prisma/client';

type CycleWithEntries = Prisma.CycleGetPayload<{
  include: {
    dayEntries: true;
  };
}>;

@Injectable()
export class CycleService {
  constructor(private prisma: PrismaService) {}

  async create(
    profileId: string,
    createCycleDto: CreateCycleDto,
  ): Promise<CycleWithEntries> {
    // Check if there's an active cycle
    const activeCycle = await this.prisma.cycle.findFirst({
      where: { profileId, isActive: true },
    });

    if (activeCycle) {
      throw new BadRequestException(
        'An active cycle already exists. Please end it before starting a new one.',
      );
    }

    const cycleData = {
      ...createCycleDto,
      startDate: new Date(createCycleDto.startDate),
      endDate: createCycleDto.endDate
        ? new Date(createCycleDto.endDate)
        : undefined,
      isActive: !createCycleDto.endDate, // Active if no end date
    };

    return this.prisma.cycle.create({
      data: {
        profileId,
        ...cycleData,
      },
      include: {
        dayEntries: true,
      },
    });
  }

  async findAll(profileId: string): Promise<CycleWithEntries[]> {
    return this.prisma.cycle.findMany({
      where: { profileId },
      include: {
        dayEntries: {
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(id: string, profileId: string): Promise<CycleWithEntries> {
    const cycle = await this.prisma.cycle.findFirst({
      where: { id, profileId },
      include: {
        dayEntries: {
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!cycle) {
      throw new NotFoundException('Cycle not found');
    }

    return cycle;
  }

  async update(
    id: string,
    profileId: string,
    updateCycleDto: UpdateCycleDto,
  ): Promise<CycleWithEntries> {
    await this.findOne(id, profileId); // Check existence

    const updateData = {
      ...updateCycleDto,
      startDate: updateCycleDto.startDate
        ? new Date(updateCycleDto.startDate)
        : undefined,
      endDate: updateCycleDto.endDate
        ? new Date(updateCycleDto.endDate)
        : undefined,
    };

    // If ending a cycle, set isActive to false
    if (updateData.endDate) {
      updateData.isActive = false;
    }

    return this.prisma.cycle.update({
      where: { id },
      data: updateData,
      include: {
        dayEntries: true,
      },
    });
  }

  async endActiveCycle(profileId: string): Promise<CycleWithEntries> {
    const activeCycle = await this.prisma.cycle.findFirst({
      where: { profileId, isActive: true },
    });

    if (!activeCycle) {
      throw new NotFoundException('No active cycle found');
    }

    return this.prisma.cycle.update({
      where: { id: activeCycle.id },
      data: {
        endDate: new Date(),
        isActive: false,
      },
      include: {
        dayEntries: true,
      },
    });
  }

  async remove(id: string, profileId: string): Promise<{ message: string }> {
    await this.findOne(id, profileId); // Check existence

    await this.prisma.cycle.delete({
      where: { id },
    });

    return { message: 'Cycle deleted successfully' };
  }

  // Day Entry Operations
  async createOrUpdateDayEntry(
    cycleId: string,
    profileId: string,
    createDayEntryDto: CreateDayEntryDto,
  ): Promise<Prisma.DayEntryGetPayload<{}>> {
    // Verify cycle belongs to user
    await this.findOne(cycleId, profileId);

    const entryDate = new Date(createDayEntryDto.date);

    // Check if entry exists for this date
    const existingEntry = await this.prisma.dayEntry.findUnique({
      where: {
        cycleId_date: {
          cycleId,
          date: entryDate,
        },
      },
    });

    const entryData = {
      ...createDayEntryDto,
      date: entryDate,
    };

    if (existingEntry) {
      // Update existing entry
      return this.prisma.dayEntry.update({
        where: { id: existingEntry.id },
        data: entryData,
      });
    } else {
      // Create new entry
      return this.prisma.dayEntry.create({
        data: {
          cycleId,
          ...entryData,
        },
      });
    }
  }

  async removeDayEntry(
    cycleId: string,
    date: string,
    profileId: string,
  ): Promise<{ message: string }> {
    // Verify cycle belongs to user
    await this.findOne(cycleId, profileId);

    const entryDate = new Date(date);

    const entry = await this.prisma.dayEntry.findUnique({
      where: {
        cycleId_date: {
          cycleId,
          date: entryDate,
        },
      },
    });

    if (!entry) {
      throw new NotFoundException('Day entry not found');
    }

    await this.prisma.dayEntry.delete({
      where: { id: entry.id },
    });

    return { message: 'Day entry deleted successfully' };
  }
}