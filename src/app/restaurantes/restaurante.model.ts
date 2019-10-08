export interface Restaurante {
    
    id: string;
    name: string;
    category: string;
    rating: number;
    imagePath: string;
    about?: string;
    hours?: string;
}