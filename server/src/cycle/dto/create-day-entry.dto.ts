import {
  IsDateString,
  IsOptional,
  IsString,
  IsArray,
  IsIn,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDayEntryDto {
  @ApiProperty({
    description: 'Date of the entry',
    example: '2024-01-15',
    format: 'date',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Symptoms experienced on this day',
    type: [String],
    example: ['cramps', 'bloating', 'headache'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @ApiProperty({
    description: 'Mood on this day',
    enum: ['happy', 'sad', 'anxious', 'irritable', 'calm', 'energetic'],
    example: 'calm',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['happy', 'sad', 'anxious', 'irritable', 'calm', 'energetic'])
  mood?: string;

  @ApiProperty({
    description: 'Additional notes for this day',
    maxLength: 500,
    example: 'Feeling better today',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    description: 'Flow intensity on this day',
    enum: ['none', 'light', 'medium', 'heavy'],
    example: 'light',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['none', 'light', 'medium', 'heavy'])
  flow?: string;

  @ApiProperty({
    description: 'Basal body temperature in Celsius',
    minimum: 35.0,
    maximum: 38.0,
    example: 36.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(35.0)
  @Max(38.0)
  temperature?: number;
}
