import { CreateCategoryDto } from "src/modules/tenant/categories/dto";
import { v4 as uuidv4 } from 'uuid';

export const categories: CreateCategoryDto[] = [
    {
        id: uuidv4(),
        name: 'Aniversário'
    },
    {
        id: uuidv4(),
        name: 'Casamento'
    },
    {
        id: uuidv4(),
        name: 'Eventos'
    },
    {
        id: uuidv4(),
        name: 'Debutantes'
    },
    {
        id: uuidv4(),
        name: 'Bodas'
    },
    {
        id: uuidv4(),
        name: 'Feira'
    },
    {
        id: uuidv4(),
        name: 'Treinamento'
    },
    {
        id: uuidv4(),
        name: 'Retiro'
    },
    {
        id: uuidv4(),
        name: 'Simpósio'
    },
    {
        id: uuidv4(),
        name: 'Seminário'
    },

    {
        id: uuidv4(),
        name: 'Palestras'
    },

    {
        id: uuidv4(),
        name: 'Cursos'
    },

    {
        id: uuidv4(),
        name: 'Congresso'
    },

    {
        id: uuidv4(),
        name: 'Festival'
    },

    {
        id: uuidv4(),
        name: 'Show'
    },
];