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

export class CreateDayEntryDto {
  @IsDateString()
  date: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['happy', 'sad', 'anxious', 'irritable', 'calm', 'energetic'])
  mood?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsString()
  @IsIn(['none', 'light', 'medium', 'heavy'])
  flow?: string;

  @IsOptional()
  @IsNumber()
  @Min(35.0)
  @Max(38.0)
  temperature?: number;
}