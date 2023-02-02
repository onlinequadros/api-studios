import { CreateCategoryDto } from 'src/modules/tenant/categories/dto';
import { v4 as uuidv4 } from 'uuid';

export const categories: CreateCategoryDto[] = [
  {
    id: uuidv4(),
    name: 'Aniversário',
    sku: 'AN0001',
  },
  {
    id: uuidv4(),
    name: 'Casamento',
    sku: 'CA0002',
  },
  {
    id: uuidv4(),
    name: 'Eventos',
    sku: 'EV0003',
  },
  {
    id: uuidv4(),
    name: 'Debutantes',
    sku: 'DE0004',
  },
  {
    id: uuidv4(),
    name: 'Bodas',
    sku: 'BO0005',
  },
  {
    id: uuidv4(),
    name: 'Feira',
    sku: 'FE0006',
  },
  {
    id: uuidv4(),
    name: 'Treinamento',
    sku: 'TR0007',
  },
  {
    id: uuidv4(),
    name: 'Retiro',
    sku: 'RE0008',
  },
  {
    id: uuidv4(),
    name: 'Simpósio',
    sku: 'SI0009',
  },
  {
    id: uuidv4(),
    name: 'Seminário',
    sku: 'SE0010',
  },

  {
    id: uuidv4(),
    name: 'Palestras',
    sku: 'PA0011',
  },

  {
    id: uuidv4(),
    name: 'Cursos',
    sku: 'CU0012',
  },

  {
    id: uuidv4(),
    name: 'Congresso',
    sku: 'CO0013',
  },

  {
    id: uuidv4(),
    name: 'Festival',
    sku: 'FS0014',
  },

  {
    id: uuidv4(),
    name: 'Show',
    sku: 'SH0015',
  },
];
