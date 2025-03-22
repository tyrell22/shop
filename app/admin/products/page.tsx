"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Pencil, Trash2, Tag, AlertCircle, Database } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { SiteHeader } from "@/components/site-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Product = {
  id: number
  name: string
  description: string
  price: number
  duration_days: number
  features: string[]
  meta_title?: string
  meta_description?: string
  focus_keywords?: string[]
  seo_slug?: string
  canonical_url?: string
  og_image_url?: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [formError, setFormError] = useState<string | null>(null)
  const [seoEnabled, setSeoEnabled] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Form state - Basic Info
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [durationDays, setDurationDays] = useState("")
  const [features, setFeatures] = useState("")

  // Form state - SEO
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [focusKeywords, setFocusKeywords] = useState("")
  const [seoSlug, setSeoSlug] = useState("")
  const [canonicalUrl, setCanonicalUrl] = useState("")
  const [ogImageUrl, setOgImageUrl] = useState("")

  useEffect(() => {
    fetchProducts()
    checkSeoEnabled()
  }, [])

  const checkSeoEnabled = async () => {
    try {
      // Check if any product has meta_title to determine if SEO is enabled
      const response = await fetch("/api/products")
      const data = await response.json()

      if (data.success && data.products && data.products.length > 0) {
        // Check if any product has meta_title property
        const hasSeo = data.products.some((p) => p.meta_title !== undefined)
        setSeoEnabled(hasSeo)
      }
    } catch (error) {
      console.error("Error checking SEO status:", error)
    }
  }

  const migrateDatabase = async () => {
    setIsMigrating(true)
    try {
      const response = await fetch("/api/migrate-db")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        setSeoEnabled(true)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to migrate database",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error migrating database:", error)
      toast({
        title: "Error",
        description: "Failed to migrate database",
        variant: "destructive",
      })
    } finally {
      setIsMigrating(false)
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/products")
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch products",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setName(product.name)
    setDescription(product.description || "")
    setPrice(product.price.toString())
    setDurationDays(product.duration_days.toString())
    setFeatures(product.features.join("\n"))

    // SEO fields
    if (seoEnabled) {
      setMetaTitle(product.meta_title || "")
      setMetaDescription(product.meta_description || "")
      setFocusKeywords(product.focus_keywords?.join(", ") || "")
      setSeoSlug(product.seo_slug || "")
      setCanonicalUrl(product.canonical_url || "")
      setOgImageUrl(product.og_image_url || "")
    }

    setIsEditing(true)
    setActiveTab("basic")
    setFormError(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        fetchProducts()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete product",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  // Update the handleSubmit function to only require name and price
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validate form - only name and price required
    if (!name.trim()) {
      setFormError("Product name is required")
      setActiveTab("basic")
      return
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setFormError("Please enter a valid price")
      setActiveTab("basic")
      return
    }

    // Set default values for optional fields
    const effectiveDurationDays = durationDays.trim() ? Number.parseInt(durationDays) : 30
    const featuresList = features.split("\n").filter((f) => f.trim() !== "")

    // Basic product data
    const productData: any = {
      name,
      description: description || "",
      price: Number.parseFloat(price),
      duration_days: effectiveDurationDays,
      features: featuresList.length > 0 ? featuresList : ["Basic Package"],
    }

    // Add SEO data if enabled
    if (seoEnabled) {
      const keywordsList = focusKeywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== "")

      productData.meta_title = metaTitle || undefined
      productData.meta_description = metaDescription || undefined
      productData.focus_keywords = keywordsList.length > 0 ? keywordsList : undefined
      productData.seo_slug = seoSlug || undefined
      productData.canonical_url = canonicalUrl || undefined
      productData.og_image_url = ogImageUrl || undefined
    }

    console.log("Submitting product data:", productData)

    try {
      let response

      if (editingProduct) {
        // Update existing product
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        })
      } else {
        // Create new product
        console.log("Sending product data:", JSON.stringify(productData))
        response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        })
      }

      const data = await response.json()
      console.log("API response:", data)

      if (data.success) {
        toast({
          title: "Success",
          description: editingProduct ? "Product updated successfully" : "Product created successfully",
        })
        resetForm()
        fetchProducts()
      } else {
        setFormError(data.message || "Failed to save product")
        toast({
          title: "Error",
          description: data.message || "Failed to save product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving product:", error)
      setFormError("An error occurred while saving the product")
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setName("")
    setDescription("")
    setPrice("")
    setDurationDays("")
    setFeatures("")
    setMetaTitle("")
    setMetaDescription("")
    setFocusKeywords("")
    setSeoSlug("")
    setCanonicalUrl("")
    setOgImageUrl("")
    setIsEditing(false)
    setFormError(null)
  }

  const generateSlug = () => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim()
      setSeoSlug(slug)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-yellow-400">Manage Products</h1>
            <div className="flex gap-2">
              {!seoEnabled && (
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={migrateDatabase}
                  disabled={isMigrating}
                >
                  {isMigrating ? (
                    <>Migrating...</>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Enable SEO Fields
                    </>
                  )}
                </Button>
              )}
              <Button className="bg-yellow-400 text-black hover:bg-yellow-300" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </>
                )}
              </Button>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {isEditing && (
            <Card className="mb-8 border-2 border-yellow-400 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-yellow-400">{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
              </CardHeader>
              <CardContent>
                {formError && (
                  <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                      <TabsTrigger
                        value="basic"
                        className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                      >
                        Basic Information
                      </TabsTrigger>
                      {seoEnabled && (
                        <TabsTrigger
                          value="seo"
                          className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                        >
                          SEO & Metadata
                        </TabsTrigger>
                      )}
                      {!seoEnabled && (
                        <div className="flex items-center justify-center text-gray-500 text-sm">
                          SEO Fields (Disabled)
                        </div>
                      )}
                    </TabsList>

                    <TabsContent value="basic" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-200">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="border-gray-700 bg-gray-800 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-200">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                          className="border-gray-700 bg-gray-800 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-gray-200">
                            Price ($)
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            className="border-gray-700 bg-gray-800 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration" className="text-gray-200">
                            Duration (days) <span className="text-gray-400 text-xs">(optional, defaults to 30)</span>
                          </Label>
                          <Input
                            id="duration"
                            type="number"
                            min="1"
                            value={durationDays}
                            onChange={(e) => setDurationDays(e.target.value)}
                            className="border-gray-700 bg-gray-800 text-white"
                            placeholder="30"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="features" className="text-gray-200">
                          Features (one per line) <span className="text-gray-400 text-xs">(optional)</span>
                        </Label>
                        <Textarea
                          id="features"
                          value={features}
                          onChange={(e) => setFeatures(e.target.value)}
                          rows={5}
                          className="border-gray-700 bg-gray-800 text-white"
                          placeholder="Enter features, one per line"
                        />
                      </div>
                    </TabsContent>

                    {seoEnabled && (
                      <TabsContent value="seo" className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="meta-title" className="text-gray-200">
                            Meta Title
                          </Label>
                          <Input
                            id="meta-title"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            className="border-gray-700 bg-gray-800 text-white"
                            placeholder="SEO optimized title (max 60 characters)"
                            maxLength={60}
                          />
                          <p className="text-xs text-gray-400">{metaTitle.length}/60 characters</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="meta-description" className="text-gray-200">
                            Meta Description
                          </Label>
                          <Textarea
                            id="meta-description"
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            className="border-gray-700 bg-gray-800 text-white"
                            placeholder="SEO optimized description (max 160 characters)"
                            maxLength={160}
                            rows={3}
                          />
                          <p className="text-xs text-gray-400">{metaDescription.length}/160 characters</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="focus-keywords" className="text-gray-200">
                            Focus Keywords (comma separated)
                          </Label>
                          <Input
                            id="focus-keywords"
                            value={focusKeywords}
                            onChange={(e) => setFocusKeywords(e.target.value)}
                            className="border-gray-700 bg-gray-800 text-white"
                            placeholder="iptv, streaming, channels"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="seo-slug" className="text-gray-200">
                              SEO Slug
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={generateSlug}
                              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black text-xs"
                            >
                              Generate from Name
                            </Button>
                          </div>
                          <Input
                            id="seo-slug"
                            value={seoSlug}
                            onChange={(e) => setSeoSlug(e.target.value)}
                            className="border-gray-700 bg-gray-800 text-white"
                            placeholder="product-slug"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="canonical-url" className="text-gray-200">
                            Canonical URL
                          </Label>
                          <Input
                            id="canonical-url"
                            value={canonicalUrl}
                            onChange={(e) => setCanonicalUrl(e.target.value)}
                            className="border-gray-700 bg-gray-800 text-white"
                            placeholder="https://example.com/products/product-slug"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="og-image" className="text-gray-200">
                            Open Graph Image URL
                          </Label>
                          <Input
                            id="og-image"
                            value={ogImageUrl}
                            onChange={(e) => setOgImageUrl(e.target.value)}
                            className="border-gray-700 bg-gray-800 text-white"
                            placeholder="https://example.com/images/product.jpg"
                          />
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="border-gray-700 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-300">
                      {editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="text-center text-yellow-400">Loading products...</div>
          ) : (
            <div className="grid gap-6">
              {products.map((product) => (
                <Card key={product.id} className="border border-gray-800 bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-yellow-400">{product.name}</h2>
                        <p className="text-gray-400">{product.description}</p>
                        <div className="mt-2">
                          <span className="text-white font-bold">${product.price.toFixed(2)}</span>
                          <span className="text-gray-400"> / {product.duration_days} days</span>
                        </div>
                        <div className="mt-2">
                          <h3 className="text-sm font-medium text-gray-300">Features:</h3>
                          <ul className="mt-1 list-disc list-inside text-sm text-gray-400">
                            {product.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        {seoEnabled && product.meta_title && (
                          <div className="mt-2 flex items-center text-sm text-gray-400">
                            <Tag className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>SEO: {product.meta_title}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

