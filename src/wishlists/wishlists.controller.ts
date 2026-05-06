import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWishlistDto, UpdateWishlistDto, AddWishlistItemDto } from './wishlists.dto';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  getAll(@Request() req) {
    return this.wishlistsService.getUserWishlists(req.user.userId);
  }

  @Get('check/:propertyId')
  check(@Request() req, @Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.wishlistsService.checkProperty(req.user.userId, propertyId);
  }

  @Post()
  create(@Request() req, @Body() dto: CreateWishlistDto) {
    return this.wishlistsService.create(req.user.userId, dto);
  }

  @Put(':id')
  update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWishlistDto) {
    return this.wishlistsService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.delete(id, req.user.userId);
  }

  @Post(':id/items')
  addItem(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() dto: AddWishlistItemDto) {
    return this.wishlistsService.addItem(id, req.user.userId, dto);
  }

  @Delete(':id/items/:itemId')
  removeItem(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.wishlistsService.removeItem(id, itemId, req.user.userId);
  }
}
