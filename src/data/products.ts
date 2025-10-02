import { Product } from '@/types/product';
import vaseImg from '@/assets/product-vase.jpg';
import bagImg from '@/assets/product-bag.jpg';
import lampImg from '@/assets/product-lamp.jpg';
import blanketImg from '@/assets/product-blanket.jpg';
import mugImg from '@/assets/product-mug.jpg';
import artImg from '@/assets/product-art.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Ceramic Vase',
    description: 'Handcrafted ceramic vase with a minimalist design. Perfect for fresh or dried flowers.',
    price: 89.00,
    image: vaseImg,
    category: 'Home Decor',
    inStock: true,
  },
  {
    id: '2',
    name: 'Leather Crossbody Bag',
    description: 'Premium full-grain leather bag with adjustable strap. Timeless design for everyday use.',
    price: 249.00,
    image: bagImg,
    category: 'Accessories',
    inStock: true,
  },
  {
    id: '3',
    name: 'Brass Table Lamp',
    description: 'Modern table lamp with brass finish and adjustable arm. Adds warmth to any space.',
    price: 159.00,
    image: lampImg,
    category: 'Lighting',
    inStock: true,
  },
  {
    id: '4',
    name: 'Cotton Throw Blanket',
    description: 'Soft cotton throw blanket in neutral tones. Perfect for cozy evenings.',
    price: 79.00,
    image: blanketImg,
    category: 'Textiles',
    inStock: true,
  },
  {
    id: '5',
    name: 'Ceramic Coffee Mug',
    description: 'Artisan-crafted coffee mug with matte finish. Comfortable grip and perfect size.',
    price: 32.00,
    image: mugImg,
    category: 'Tableware',
    inStock: true,
  },
  {
    id: '6',
    name: 'Abstract Wall Art',
    description: 'Limited edition print featuring organic shapes in earth tones. Professionally framed.',
    price: 189.00,
    image: artImg,
    category: 'Art',
    inStock: true,
  },
];
