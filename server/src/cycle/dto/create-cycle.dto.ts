import {
  IsDateString,
  IsOptional,
  IsString,
  IsArray,
  IsIn,
  MaxLength,
} from 'class-validator';

export class CreateCycleDto {
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['light', 'medium', 'heavy'])
  flow?: string;
}