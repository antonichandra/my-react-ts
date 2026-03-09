import { useState } from 'react';
import { Save, Loader2, Package, DollarSign, Tag, Layers, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { PageWrapper } from '../components/ui/PageWrapper';
import { FormFieldArray, type FormFieldConfig } from '../components/ui/FormFieldArray';
import { useFormData } from '../hooks/useFormData';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  cost: string;
  category: string;
  sku: string;
  stock: string;
  minStock: string;
  isActive: boolean;
  isFeatured: boolean;
  weight: string;
  dimensions: string;
}

interface Category {
  id: string;
  name: string;
}

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Books' },
  { id: '4', name: 'Home & Garden' },
  { id: '5', name: 'Sports' },
  { id: '6', name: 'Toys' },
];

const categoryOptions = mockCategories.map(c => ({
  label: c.name,
  value: c.id,
}));

export default function ProductPage() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const initialData: Partial<ProductFormData> = {
    name: '',
    description: '',
    price: '',
    cost: '',
    category: '',
    sku: '',
    stock: '',
    minStock: '10',
    isActive: true,
    isFeatured: false,
    weight: '',
    dimensions: '',
  };

  const { formData, setData, setError, reset, setFieldValue } = useFormData<ProductFormData>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validate required fields
      if (!formData.data.name?.trim()) {
        setError('name', 'Product name is required');
        setIsSaving(false);
        return;
      }

      if (!formData.data.price?.trim()) {
        setError('price', 'Price is required');
        setIsSaving(false);
        return;
      }

      if (!formData.data.category?.trim()) {
        setError('category', 'Category is required');
        setIsSaving(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Product saved:', formData.data);
      alert('Product saved successfully!');
    } catch (err) {
      console.error('Failed to save product:', err);
      setError('name', 'Failed to save product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Define form fields as array
  const productFields: FormFieldConfig<ProductFormData>[] = [
    { component: 'title', label: 'Basic Information', icon: Package, colSpan: 2 },
    { component: 'input', label: 'Product Name', field: 'name', required: true, colSpan: 2, props: { placeholder: 'Enter product name' } },
    { component: 'textarea', label: 'Description', field: 'description', colSpan: 2, props: { placeholder: 'Enter product description' } },
    { component: 'select', label: 'Category', field: 'category', required: true, colSpan: 1, props: { options: categoryOptions, placeholder: 'Select category', searchable: true } },
    { component: 'input', label: 'SKU', field: 'sku', colSpan: 1, props: { placeholder: 'Enter SKU' } },
    { component: 'title', label: 'Pricing', icon: DollarSign, colSpan: 2 },
    { component: 'input', label: 'Selling Price', field: 'price', required: true, colSpan: 1, props: { currency: true, prefix: '$', placeholder: '0.00', decimalScale: 2 } },
    { component: 'input', label: 'Cost Price', field: 'cost', colSpan: 1, props: { currency: true, prefix: '$', placeholder: '0.00', decimalScale: 2 } },
    { component: 'title', label: 'Inventory', icon: Layers, colSpan: 2 },
    { component: 'input', label: 'Current Stock', field: 'stock', colSpan: 1, props: { type: 'number', placeholder: '0' } },
    { component: 'input', label: 'Minimum Stock', field: 'minStock', colSpan: 1, props: { type: 'number', placeholder: '10' } },
    { component: 'input', label: 'Weight (kg)', field: 'weight', colSpan: 1, props: { type: 'number', placeholder: '0' } },
    { component: 'input', label: 'Dimensions', field: 'dimensions', colSpan: 1, props: { placeholder: 'L x W x H' } },
    { component: 'title', label: 'Status', icon: Tag, colSpan: 2 },
    { component: 'switch', label: 'Active', field: 'isActive', colSpan: 1, props: { label: 'Product is active and available for sale' } },
    { component: 'switch', label: 'Featured', field: 'isFeatured', colSpan: 1, props: { label: 'Show this product in featured sections' } },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <PageWrapper>
        <header className="flex justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Products</h1>
        </header>
        <Card className="relative border-0 shadow-lg ring-1 ring-zinc-950/5 dark:ring-white/10">
          <LoadingOverlay isLoading={isSaving} message="Saving..." />
          
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-1 h-auto hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">Add New Product</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Fill in the product details below
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className={isSaving ? "pointer-events-none" : ""}>
              <FormFieldArray
                fields={productFields}
                formData={formData}
                formHelpers={{ setData, setError, reset, setFieldValue }}
                gridCols={2}
                gap={4}
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PageWrapper>
    </div>
  );
}
