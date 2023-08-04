import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { propertyType } from '@prisma/client';

interface GetHomesParam {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType: propertyType;
}

interface CreateHomeParam {
  address: string;
  numberOfBedrooms: number;
  numberOfBethrooms: number;
  city: string;
  landSize: number;
  propertyType: propertyType;
  price: number;
  images: Array<{ url: string }>;
}
interface UpdateHomeParam {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBethrooms?: number;
  city?: string;
  landSize?: number;
  propertyType?: propertyType;
  price?: number;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllHomes(filter: GetHomesParam): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        address: true,
        city: true,
        id: true,
        price: true,
        propertyType: true,
        number_of_bedrooms: true,
        number_of_bethrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filter,
    });

    if (!homes.length) {
      throw new NotFoundException();
    }
    return homes.map((home) => {
      const fetchedHome = { ...home, image: home.images[0].url };
      delete fetchedHome.images;
      return new HomeResponseDto(fetchedHome);
    });
  }

  async getHomeById(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }

  async createHome({
    address,
    city,
    images,
    landSize,
    numberOfBedrooms,
    numberOfBethrooms,
    price,
    propertyType,
  }: CreateHomeParam) {
    const home = await this.prismaService.home.create({
      data: {
        address: address,
        city: city,
        land_size: landSize,
        number_of_bedrooms: numberOfBedrooms,
        number_of_bethrooms: numberOfBethrooms,
        price: price,
        propertyType: propertyType,
        realtor_id: 5,
      },
    });

    const homeImages = images.map((image) => {
      return {
        ...image,
        home_id: home.id,
      };
    });

    await this.prismaService.image.createMany({
      data: homeImages,
    });

    return new HomeResponseDto(home);
  }

  async updateHome(id: number, body: UpdateHomeParam) {
    const home = await this.prismaService.home.findUnique({ where: { id } });

    if (!home) {
      throw new NotFoundException();
    }
    const updatedHome = await this.prismaService.home.update({
      where: { id },
      data: body,
    });

    return new HomeResponseDto(updatedHome);
  }

  async deleteHomeById(id: number) {
    await this.prismaService.home.delete({ where: { id } });
  }
}
