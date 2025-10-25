import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  description: string | null;
  order: number;
}

export function AddMenuItemDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    deliveryFee: '',
    categoryId: '',
    available: true,
    popular: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('deliveryFee', formData.deliveryFee || '0');
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('available', formData.available.toString());
      formDataToSend.append('popular', formData.popular.toString());
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch('/api/menu-items', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Menu item added successfully',
        });
        setOpen(false);
        resetForm();
        onSuccess();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to add menu item',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to add menu item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add menu item',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      deliveryFee: '',
      categoryId: '',
      available: true,
      popular: false,
    });
    setImageFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogDescription>
            Add a new item to your restaurant menu with all the details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Crêpe Nutella"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Describe the item..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (DT) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryFee">Delivery Fee (DT)</Label>
              <Input
                id="deliveryFee"
                type="number"
                step="0.01"
                min="0"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Item Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-muted-foreground">
              Upload an image (JPG, PNG, GIF, WEBP - Max 5MB)
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, available: checked as boolean })
                }
              />
              <Label htmlFor="available" className="font-normal cursor-pointer">
                Available for order
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="popular"
                checked={formData.popular}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, popular: checked as boolean })
                }
              />
              <Label htmlFor="popular" className="font-normal cursor-pointer">
                Mark as popular item
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
