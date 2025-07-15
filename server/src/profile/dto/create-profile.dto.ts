import {
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
  IsArray,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    description: 'Date of last period',
    example: '2024-01-01',
    required: false,
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  lastPeriodDate?: string;

  @ApiProperty({
    description: 'Average cycle length in days',
    minimum: 21,
    maximum: 45,
    example: 28,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(21)
  @Max(45)
  @Type(() => Number)
  cycleLength?: number;

  @ApiProperty({
    description: 'Average period duration in days',
    minimum: 1,
    maximum: 10,
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  periodDuration?: number;

  @ApiProperty({
    description: 'Common symptoms experienced',
    type: [String],
    example: ['cramps', 'headache', 'mood swings'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @ApiProperty({
    description: 'Contraception method used',
    maxLength: 100,
    example: 'Birth control pill',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  contraception?: string;

  @ApiProperty({
    description: 'Additional notes',
    maxLength: 500,
    example: 'Regular cycles, no irregularities',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  notes?: string;
}
