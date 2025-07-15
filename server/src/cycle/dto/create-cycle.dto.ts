import {
  IsDateString,
  IsOptional,
  IsString,
  IsArray,
  IsIn,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCycleDto {
  @ApiProperty({
    description: 'Start date of the cycle',
    example: '2024-01-01',
    format: 'date',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date of the cycle',
    example: '2024-01-28',
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Notes about this cycle',
    maxLength: 500,
    example: 'Experienced mild cramps on day 2',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    description: 'Symptoms experienced during this cycle',
    type: [String],
    example: ['cramps', 'headache', 'fatigue'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @ApiProperty({
    description: 'Flow intensity',
    enum: ['light', 'medium', 'heavy'],
    example: 'medium',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['light', 'medium', 'heavy'])
  flow?: string;
}
