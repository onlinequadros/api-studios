import { Body, Controller, Get, Post } from '@nestjs/common';
import { AlbumPhotoService } from './album-photo.service';
import { CreateAlbumPhotoDto, ReadAlbumPhotoDto } from './dto';

@Controller('album_photo')
export class AlbumPhotoController {
  constructor(private readonly albumPhotoService: AlbumPhotoService) {}

  @Get()
  async findAll(): Promise<ReadAlbumPhotoDto[]> {
    return this.albumPhotoService.findAll();
  }

  @Post()
  async create(
    @Body() albumPhoto: CreateAlbumPhotoDto,
  ): Promise<ReadAlbumPhotoDto> {
    return this.albumPhotoService.create(albumPhoto);
  }
}
