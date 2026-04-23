import { 
  Controller, 
  Post, 
  Patch, 
  Put, 
  Get, 
  Param, 
  Body, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  UploadedFile, 
  Delete, 
  ParseIntPipe 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HostService } from './host.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { 
  UpdateBasicsDto, 
  UpdateFloorPlanDto, 
  UpdateContentDto, 
  UpdatePricingDto, 
  UpdatePoliciesDto,
  UpdateAmenitiesDto,
  UpdateArrivalGuideDto,
  UpdateCalendarDto
} from './host.dto';

import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('host/listings')
@UseGuards(JwtAuthGuard)
export class HostController {
  constructor(private readonly hostService: HostService) {}

  @Post('initiate')
  initiate(@Request() req) {
    return this.hostService.initiateListing(req.user.id);
  }

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.hostService.getDashboard(req.user.id);
  }

  @Get()
  getListings(@Request() req) {
    return this.hostService.getListings(req.user.id);
  }
  @Get(':id')
  getOne(
    @Param('id') id: string,
    @Request() req
  ) {
    return this.hostService.findOneOwned(parseInt(id, 10), req.user.id);
  }

  @Patch(':id/arrival-guide')
  updateArrivalGuide(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateArrivalGuideDto
  ) {
    return this.hostService.updateArrivalGuide(parseInt(id, 10), req.user.id, dto);
  }

  @Patch(':id/calendar')
  updateCalendar(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateCalendarDto
  ) {
    return this.hostService.updateCalendar(parseInt(id, 10), req.user.id, dto);
  }


  @Patch(':id/basics')
  updateBasics(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: any
  ) {
    const numericId = parseInt(id, 10);
    console.log(`Update basics for ID: ${id} (parsed: ${numericId})`, dto);
    return this.hostService.updateBasics(numericId, req.user.id, dto);
  }

  @Patch(':id/floor-plan')
  updateFloorPlan(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateFloorPlanDto
  ) {
    return this.hostService.updateFloorPlan(parseInt(id, 10), req.user.id, dto);
  }

  @Put(':id/amenities')
  updateAmenities(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateAmenitiesDto
  ) {
    return this.hostService.updateAmenities(parseInt(id, 10), req.user.id, dto);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/properties',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  uploadImage(
    @Param('id') id: string,
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    const fileUrl = `/uploads/properties/${file.filename}`;
    return this.hostService.addImage(parseInt(id, 10), req.user.id, fileUrl);
  }

  @Patch(':id/content')
  updateContent(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateContentDto
  ) {
    return this.hostService.updateContent(parseInt(id, 10), req.user.id, dto);
  }

  @Patch(':id/pricing')
  updatePricing(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdatePricingDto
  ) {
    return this.hostService.updatePricing(parseInt(id, 10), req.user.id, dto);
  }

  @Patch(':id/policies')
  updatePolicies(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdatePoliciesDto
  ) {
    return this.hostService.updatePolicies(parseInt(id, 10), req.user.id, dto);
  }


  @Post('verify-identity')
  verifyIdentity(@Request() req) {
    return this.hostService.verifyIdentity(req.user.id);
  }

  @Post('verify-phone')
  verifyPhone(@Request() req) {
    return this.hostService.verifyPhone(req.user.id);
  }

  @Post('send-otp')
  sendOtp(@Body('phone') phone: string) {
    return this.hostService.sendOtp(phone);
  }

  @Post(':id/publish')
  publish(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.hostService.publishListing(id, req.user.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req
  ) {
    return this.hostService.remove(parseInt(id, 10), req.user.id);
  }
}
