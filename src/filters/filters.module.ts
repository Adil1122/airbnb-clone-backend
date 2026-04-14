import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
import { GuestCategory, SearchDuration } from '../entities/filter-options.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GuestCategory, SearchDuration])],
    providers: [FiltersService],
    controllers: [FiltersController],
    exports: [FiltersService],
})
export class FiltersModule { }
