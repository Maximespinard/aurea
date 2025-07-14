import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto';
import { Prisma } from '@prisma/client';

// Type for profile queries that include user data
type ProfileWithUser = Prisma.ProfileGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        username: true;
        email: true;
      };
    };
  };
}>;

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createProfileDto: CreateProfileDto,
  ): Promise<ProfileWithUser> {
    try {
      // Check if profile already exists
      const existingProfile = await this.prisma.profile.findUnique({
        where: { userId },
      });

      if (existingProfile) {
        throw new ConflictException('Profile already exists for this user');
      }

      // Convert date string to Date object if provided
      const profileData = {
        ...createProfileDto,
        userId,
        lastPeriodDate: createProfileDto.lastPeriodDate
          ? new Date(createProfileDto.lastPeriodDate)
          : undefined,
      };

      const profile = await this.prisma.profile.create({
        data: profileData,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      return profile;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to create profile');
    }
  }

  async findByUserId(userId: string): Promise<ProfileWithUser> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileWithUser> {
    try {
      // Check if profile exists
      const existingProfile = await this.prisma.profile.findUnique({
        where: { userId },
      });

      if (!existingProfile) {
        throw new NotFoundException('Profile not found');
      }

      // Convert date string to Date object if provided
      const updateData = {
        ...updateProfileDto,
        lastPeriodDate: updateProfileDto.lastPeriodDate
          ? new Date(updateProfileDto.lastPeriodDate)
          : undefined,
      };

      const profile = await this.prisma.profile.update({
        where: { userId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      return profile;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update profile');
    }
  }

  async checkProfileExists(userId: string): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    return !!profile;
  }
}
