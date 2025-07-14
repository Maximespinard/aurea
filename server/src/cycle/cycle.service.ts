import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCycleDto, UpdateCycleDto, CreateDayEntryDto } from './dto';
import type { Prisma, DayEntry } from '@prisma/client';

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

    const updatedCycle = await this.prisma.cycle.update({
      where: { id: activeCycle.id },
      data: {
        endDate: new Date(),
        isActive: false,
      },
      include: {
        dayEntries: true,
      },
    });

    // Update profile averages after ending a cycle
    await this.updateProfileAverages(profileId);

    return updatedCycle;
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
  ): Promise<DayEntry> {
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

  // Prediction Methods
  async calculatePredictions(profileId: string) {
    // Get all completed cycles for this profile
    const cycles = await this.prisma.cycle.findMany({
      where: {
        profileId,
        endDate: { not: null },
      },
      orderBy: { startDate: 'desc' },
      take: 6, // Use last 6 cycles for better average
    });

    // Get profile for default values
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Calculate average cycle length
    let averageCycleLength = profile.cycleLength || 28;
    if (cycles.length >= 2) {
      const cycleLengths: number[] = [];
      for (let i = 0; i < cycles.length - 1; i++) {
        const currentStart = new Date(cycles[i].startDate);
        const nextStart = new Date(cycles[i + 1].startDate);
        const daysDiff = Math.floor(
          (currentStart.getTime() - nextStart.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        cycleLengths.push(daysDiff);
      }
      averageCycleLength = Math.round(
        cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length,
      );
    }

    // Calculate average period duration
    let averagePeriodDuration = profile.periodDuration || 5;
    const completedCycles = cycles.filter((c) => c.endDate);
    if (completedCycles.length > 0) {
      const durations = completedCycles.map((cycle) => {
        const start = new Date(cycle.startDate);
        const end = new Date(cycle.endDate!);
        return Math.floor(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1,
        );
      });
      averagePeriodDuration = Math.round(
        durations.reduce((a, b) => a + b, 0) / durations.length,
      );
    }

    // Get the most recent cycle or period start
    const lastCycle = await this.prisma.cycle.findFirst({
      where: { profileId },
      orderBy: { startDate: 'desc' },
    });

    const lastPeriodStart = lastCycle
      ? new Date(lastCycle.startDate)
      : profile.lastPeriodDate
        ? new Date(profile.lastPeriodDate)
        : null;

    // Calculate predictions
    let nextPeriodDate: Date | null = null;
    let fertileWindowStart: Date | null = null;
    let fertileWindowEnd: Date | null = null;

    if (lastPeriodStart) {
      // Next period prediction
      nextPeriodDate = new Date(lastPeriodStart);
      nextPeriodDate.setDate(nextPeriodDate.getDate() + averageCycleLength);

      // Fertile window (typically days 10-15 of cycle, but we'll use 12-16 for 5-day window)
      // Ovulation typically occurs 14 days before next period
      const ovulationDay = averageCycleLength - 14;
      fertileWindowStart = new Date(lastPeriodStart);
      fertileWindowStart.setDate(
        fertileWindowStart.getDate() + ovulationDay - 3,
      );
      fertileWindowEnd = new Date(lastPeriodStart);
      fertileWindowEnd.setDate(fertileWindowEnd.getDate() + ovulationDay + 2);
    }

    return {
      nextPeriodDate,
      fertileWindowStart,
      fertileWindowEnd,
      averageCycleLength,
      averagePeriodDuration,
    };
  }

  async updateProfileAverages(profileId: string) {
    const predictions = await this.calculatePredictions(profileId);

    // Update profile with calculated averages
    await this.prisma.profile.update({
      where: { id: profileId },
      data: {
        cycleLength: predictions.averageCycleLength,
        periodDuration: predictions.averagePeriodDuration,
      },
    });
  }
}
