import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Property } from '../entities/property.entity';
import { PropertyImage } from '../entities/property-image.entity';
import { Amenity } from '../entities/amenity.entity';
import { Review } from '../entities/review.entity';
import { PropertyRule } from '../entities/property-rule.entity';
import { RuleCategory } from '../entities/rule-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, PropertyImage, Amenity, Review, PropertyRule, RuleCategory])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule { }
