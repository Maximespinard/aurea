import { PartialType } from '@nestjs/mapped-types';
import { CreateCycleDto } from './create-cycle.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCycleDto extends PartialType(CreateCycleDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
