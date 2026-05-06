import { Controller, Get, Post, Put, Param, Body, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReviewDto, RespondToReviewDto } from './reviews.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('listing/:propertyId')
  getByListing(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.reviewsService.getByListing(propertyId);
  }

  @Get('listing/:propertyId/summary')
  getSummary(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.reviewsService.getListingRatingSummary(propertyId);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  getMine(@Request() req) {
    return this.reviewsService.getByUser(req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.userId, dto);
  }

  @Put(':id/response')
  @UseGuards(JwtAuthGuard)
  respond(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RespondToReviewDto,
  ) {
    return this.reviewsService.respondToReview(id, req.user.userId, dto);
  }
}
