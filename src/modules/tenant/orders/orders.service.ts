import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThan, Repository } from 'typeorm';
import { TenantProvider } from '../tenant.provider';
import { CreateOrdersDTO } from './dto/createOrder.dto';
import { Orders } from './entities/orders.entity';
import * as moment from 'moment';
import { UpdateOrdersDTO } from './dto/updateOrder.dto';
import { ProductStudioPhoto } from '../product_studio_photos/entities/product-studio-photo.entity';
import { ProductStudioPhotoService } from '../product_studio_photos/product-studio-photo.service';
import { CheckImagesDTO } from '../product_studio_photos/dto/check.dto';
import { UpdateOrderItemsDto } from './dto/updateOrderItems.dto';
import { ImagesService } from '../../../modules/utils/images.service';
import * as sharp from 'sharp';

@Injectable()
export class OrdersService {
  private ordersRepository: Repository<Orders>;
  private productStudioPhotosRepository: Repository<ProductStudioPhoto>;

  getOrdersRepository() {
    if (TenantProvider.connection) {
      this.ordersRepository = TenantProvider.connection.getRepository(Orders);
    }
  }

  getProductStudioPhotosRepository() {
    if (TenantProvider.connection) {
      this.productStudioPhotosRepository =
        TenantProvider.connection.getRepository(ProductStudioPhoto);
    }
  }
  constructor(
    @InjectRepository(Orders)
    private readonly repository: Repository<Orders>,
    private readonly productStudioPhotoService: ProductStudioPhotoService,
    private readonly imagesService: ImagesService,
  ) {
    this.getOrdersRepository();
    this.getProductStudioPhotosRepository();
  }

  async create(createOrdersDTO: CreateOrdersDTO): Promise<Orders> {
    this.getOrdersRepository();
    const { orders_extra_items, orders_extra_photos, orders_photos } =
      createOrdersDTO;

    const order = await this.ordersRepository.create(createOrdersDTO);
    order.orders_extra_items = orders_extra_items;
    order.orders_extra_photos = orders_extra_photos;
    order.orders_photos = orders_photos;

    await this.ordersRepository.save(order);

    return order;
  }

  async findAll(): Promise<Orders[]> {
    this.getOrdersRepository();
    const orders = await this.ordersRepository.find({
      order: {
        created_at: 'DESC',
      },
      relations: ['orders_extra_items', 'orders_extra_photos', 'orders_photos'],
    });
    return orders;
  }

  async findOne(id: string): Promise<Orders> {
    this.getOrdersRepository();
    const order = await this.ordersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['orders_extra_items', 'orders_extra_photos', 'orders_photos'],
    });

    return order;
  }

  async delete(id: string) {
    this.getOrdersRepository();
    return await this.ordersRepository.delete({
      id: id,
    });
  }

  async ordersReport(option: any): Promise<Orders[]> {
    this.getOrdersRepository();
    const startDate = moment().startOf(option);
    const endDate = moment().endOf(option);

    const orders = await this.ordersRepository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
      order: {
        created_at: 'DESC',
      },
      relations: ['orders_extra_items', 'orders_extra_photos', 'orders_photos'],
    });
    return orders;
  }

  async ordersReportFilter(start: string, end: string): Promise<Orders[]> {
    this.getOrdersRepository();

    const orders = await this.ordersRepository.find({
      where: {
        created_at: Between(start, end),
      },
      order: {
        created_at: 'DESC',
      },
      relations: ['orders_extra_items', 'orders_extra_photos', 'orders_photos'],
    });
    return orders;
  }

  // FUNÇÃO PARA ALTERAR A QUANTIDADE DE ITENS DE UM PRODUTO FÍSICO
  async update(id: string, updateOrdersDTO: UpdateOrdersDTO) {
    this.getOrdersRepository();

    const order = await this.findOne(id);

    const orderUpdated = Object.assign(order, updateOrdersDTO);

    const orderSaved = await this.ordersRepository.save(orderUpdated);

    return orderSaved;
  }

  // FUNÇÃO PARA ALTERAR A QUANTIDADE DE ITENS DE UM PRODUTO FÍSICO
  async updateQuantity(id: string, payload: { quantity: number; id: string }) {
    this.getOrdersRepository();

    const order = await this.findOne(id);

    order.orders_extra_items.map((item) => {
      if (item.id === payload.id) {
        item.quantity = payload.quantity;
      }
      return item;
    });

    const orderUpdated = Object.assign(order);

    const orderSaved = await this.ordersRepository.save(orderUpdated);

    return orderSaved;
  }

  //FUNÇÃO PARA ALTERAR O ESTATUS DE PAGAMENTO
  async updateStatusOrderPayment(
    id: string,
    statusPayment: { status: 'APPROVED' | 'RECUSED' },
  ) {
    this.getOrdersRepository();

    const order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    order.status = statusPayment.status;

    const orderSaved = await this.ordersRepository.save(order);

    return orderSaved;
  }

  // FUNÇÃO PARA FAZER O UPDATE DENTRO DO ARRAY NO OBJETO DE ORDER EXTRA ITEMS
  async updateExtraItems(
    id_order: string,
    id_extraitems: string,
    updateOrdersItemsDTO: UpdateOrderItemsDto,
  ) {
    this.getOrdersRepository();

    const order = await this.findOne(id_order);

    if (!order) {
      throw new NotFoundException('Ordem não encontrada.');
    }

    const indexObject = order.orders_extra_items.findIndex(
      (item) => item.id === id_extraitems,
    );

    if (indexObject < 0) {
      throw new NotFoundException('Item extra não encontrado.');
    }

    // extraimos a imagem copm a extensão da url nos extras items
    // const image = order.orders_extra_items[indexObject].url_image
    //   .split('/')
    //   .slice(-1);

    // fazemos um split para pegar o nome da imagem sem a extensão
    // O nome da imagem é o id da imagem em alta resolução
    // const imageId = await this.imagesService.split(image);

    // buscamos a imagem original para fazer o crop e salvar
    // const photo = await this.productStudioPhotoService.findOne(imageId);

    order.orders_extra_items[indexObject].sku = updateOrdersItemsDTO.sku;
    order.orders_extra_items[indexObject].category =
      updateOrdersItemsDTO.category;
    order.orders_extra_items[indexObject].product_name =
      updateOrdersItemsDTO.product_name;
    order.orders_extra_items[indexObject].quantity =
      updateOrdersItemsDTO.quantity;
    order.orders_extra_items[indexObject].url_cropped =
      updateOrdersItemsDTO.url_cropped;
    order.orders_extra_items[indexObject].image_dimension_frame =
      updateOrdersItemsDTO.image_dimension_frame;
    order.orders_extra_items[indexObject].price =
      updateOrdersItemsDTO.price.toString();

    const orderSaved = await this.ordersRepository.save(order);

    return orderSaved;
  }

  async deleteExtraPhoto(orderId: string, imageId: string) {
    this.getOrdersRepository();
    this.getProductStudioPhotosRepository();

    const order = await this.findOne(orderId);
    const extraPhotos = order.orders_extra_photos;

    const image = extraPhotos.findIndex(
      (photo) => photo.product_id == imageId['id'],
    );

    if (image >= 0) {
      extraPhotos.splice(image, 1);
    }

    order.orders_extra_photos = extraPhotos;
    await this.ordersRepository.save(order);

    const images = {
      images: [
        {
          id: imageId['id'],
          check: false,
          order: false,
        },
      ],
    };

    await this.productStudioPhotoService.setCheckedOrder(images);
  }

  async deleteExtraItem(orderId: string, itemId: string) {
    this.getOrdersRepository();

    const order = await this.findOne(orderId);
    const extraItems = order.orders_extra_items;

    const item = extraItems.findIndex((item) => item.id == itemId['id']);

    if (item >= 0) {
      extraItems.splice(item, 1);
    }

    order.orders_extra_items = extraItems;
    await this.ordersRepository.save(order);
  }
}
