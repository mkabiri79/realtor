import { propertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HomeResponseDto {
  'id': number;
  'address': string;

  @Exclude()
  'number_of_bedrooms': number;

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude()
  'number_of_bethrooms': number;

  @Expose({ name: 'numberOfBethrooms' })
  numberOfBethrooms() {
    return this.number_of_bethrooms;
  }

  'city': string;

  'image': string;

  @Exclude()
  'listed_date': Date;

  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }

  'price': number;

  @Exclude()
  'land_size': number;

  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  'propertyType': propertyType;

  @Exclude()
  'created_at': Date;

  @Exclude()
  'updated_at': Date;

  @Exclude()
  'realtor_id': number;

  @Expose({ name: 'realtorId' })
  realtorId() {
    return this.realtor_id;
  }

  constructor(paritial: Partial<HomeResponseDto>) {
    Object.assign(this, paritial);
  }
}

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBethrooms: number;

  @IsString()
  city: string;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsString()
  @IsEnum(propertyType)
  propertyType: propertyType;

  @IsNumber()
  price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Array<Image>;
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBethrooms?: number;
  @IsOptional()
  @IsString()
  city?: string;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;
  @IsOptional()
  @IsString()
  @IsEnum(propertyType)
  propertyType?: propertyType;
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class InquireDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
