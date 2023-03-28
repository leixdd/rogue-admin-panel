export interface IItem{
    name: string;
    description: string;
    price: number;
    image: string;
    code: string;
    pwd: string;
    createdAt?: Date;
    updatedAt?: Date;
    active: boolean;
    sold: boolean
}