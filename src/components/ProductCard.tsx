import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart');
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <h3 className="font-medium group-hover:text-accent transition-colors">
                {product.name}
              </h3>
            </div>
            <p className="font-semibold">${product.price.toFixed(2)}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full"
            variant="outline"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};
