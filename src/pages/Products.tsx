import { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const categories = ['All', ...new Set(products?.map(p => p.category) || [])];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products?.filter(p => p.category === selectedCategory);

  return (
    <main className="flex-1 py-12">
      <div className="container">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Shop All
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Explore our complete collection of curated products
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            filteredProducts?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {!isLoading && (!filteredProducts || filteredProducts.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found in this category</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
