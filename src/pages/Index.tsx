import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';
import heroImg from '@/assets/hero-banner.jpg';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src={heroImg}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/60" />
        <div className="relative container h-full flex items-center">
          <div className="max-w-xl space-y-6">
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
              Curated for Modern Living
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover timeless pieces that blend form and function. Each item is thoughtfully selected for quality and design.
            </p>
            <Link to="/products">
              <Button size="lg" className="group">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked pieces that represent the essence of our collection
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-lg">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                On orders over $100
              </p>
            </div>
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-lg">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                30-day return policy
              </p>
            </div>
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-lg">Curated Selection</h3>
              <p className="text-sm text-muted-foreground">
                Handpicked by our team
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
