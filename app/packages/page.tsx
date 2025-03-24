import { getProducts } from "@/lib/product-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  features: string[];
};

export default async function PackagesPage({ searchParams }: { searchParams: { renew?: string } }) {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  const renewProductId = searchParams.renew;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-yellow-400">
                Choose Your Crisp TV Package
              </h1>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Select the perfect plan for your entertainment needs
              </p>
            </div>
          </div>
          {products.length === 0 ? (
            <div className="mt-8 text-center text-gray-400">No products available at this time.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`flex flex-col p-6 bg-gray-900 rounded-lg border-2 ${
                    renewProductId === product.id.toString()
                      ? "border-green-500 shadow-lg shadow-green-500/20"
                      : "border-yellow-400"
                  }`}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-yellow-400">{product.name}</CardTitle>
                    <p className="text-sm text-gray-400">{product.description}</p>
                    <div className="mt-2 text-3xl font-bold text-white">
                      ${typeof product.price === "number" ? product.price.toFixed(2) : "0.00"}
                      <span className="text-sm font-normal text-gray-400">
                        {product.duration_days === 30
                          ? "/month"
                          : product.duration_days === 365
                          ? "/year"
                          : `/${product.duration_days} days`}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      {Array.isArray(product.features) &&
                        product.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-5 h-5 mr-2 text-yellow-400"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-4 flex flex-col gap-2">
                    <Link href={`/checkout?productId=${product.id}`}>
                      <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-300">
                        {renewProductId === product.id.toString() ? "Renew Subscription" : "Subscribe Now"}
                      </Button>
                    </Link>
                    <form
                      action="/api/cart/add"
                      method="POST"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        fetch("/api/cart/add", {
                          method: "POST",
                          body: formData,
                        }).then(() => {
                          // Redirect to cart page
                          window.location.href = "/cart";
                        });
                      }}
                    >
                      <input type="hidden" name="productId" value={product.id} />
                      <input type="hidden" name="name" value={product.name} />
                      <input type="hidden" name="price" value={product.price} />
                      <input type="hidden" name="duration_days" value={product.duration_days} />
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
