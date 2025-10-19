import { 
  type Category, 
  type InsertCategory,
  type MenuItem, 
  type InsertMenuItem,
  type Reservation,
  type InsertReservation,
  type Order,
  type InsertOrder
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;

  // Reservations
  getReservations(): Promise<Reservation[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;

  // Orders
  getOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private menuItems: Map<string, MenuItem>;
  private reservations: Map<string, Reservation>;
  private orders: Map<string, Order>;

  constructor() {
    this.categories = new Map();
    this.menuItems = new Map();
    this.reservations = new Map();
    this.orders = new Map();

    // Initialize with default categories and menu items
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create categories
    const sweetCategory: Category = {
      id: "sweet",
      name: "Sweet Crêpes",
      description: "Delicious sweet crêpes perfect for dessert or a special treat",
      order: 1,
    };

    const savoryCategory: Category = {
      id: "savory",
      name: "Savory Crêpes",
      description: "Hearty savory crêpes ideal for lunch or dinner",
      order: 2,
    };

    this.categories.set(sweetCategory.id, sweetCategory);
    this.categories.set(savoryCategory.id, savoryCategory);

    // Create sample menu items
    const defaultMenuItems: MenuItem[] = [
      {
        id: randomUUID(),
        name: "Classic Nutella",
        description: "Rich Nutella chocolate spread with sliced bananas and toasted hazelnuts",
        price: "8.50",
        categoryId: "sweet",
        imageUrl: null,
        available: true,
        popular: true,
      },
      {
        id: randomUUID(),
        name: "Strawberry Dream",
        description: "Fresh strawberries, whipped cream, and a dusting of powdered sugar",
        price: "9.00",
        categoryId: "sweet",
        imageUrl: null,
        available: true,
        popular: true,
      },
      {
        id: randomUUID(),
        name: "Lemon Sugar",
        description: "Traditional crêpe with fresh lemon juice and fine sugar",
        price: "7.00",
        categoryId: "sweet",
        imageUrl: null,
        available: true,
        popular: false,
      },
      {
        id: randomUUID(),
        name: "Salted Caramel",
        description: "Homemade salted caramel sauce with vanilla ice cream",
        price: "9.50",
        categoryId: "sweet",
        imageUrl: null,
        available: true,
        popular: false,
      },
      {
        id: randomUUID(),
        name: "Ham & Cheese",
        description: "Premium French ham with melted Gruyère cheese and fresh herbs",
        price: "10.50",
        categoryId: "savory",
        imageUrl: null,
        available: true,
        popular: true,
      },
      {
        id: randomUUID(),
        name: "Complete",
        description: "Ham, cheese, and a sunny-side-up egg - a French classic",
        price: "12.00",
        categoryId: "savory",
        imageUrl: null,
        available: true,
        popular: true,
      },
      {
        id: randomUUID(),
        name: "Mushroom & Spinach",
        description: "Sautéed mushrooms, fresh spinach, and creamy béchamel sauce",
        price: "11.00",
        categoryId: "savory",
        imageUrl: null,
        available: true,
        popular: false,
      },
      {
        id: randomUUID(),
        name: "Smoked Salmon",
        description: "Norwegian smoked salmon, cream cheese, capers, and red onion",
        price: "13.50",
        categoryId: "savory",
        imageUrl: null,
        available: true,
        popular: false,
      },
    ];

    defaultMenuItems.forEach(item => {
      this.menuItems.set(item.id, item);
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = insertCategory.name.toLowerCase().replace(/\s+/g, '-');
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const item: MenuItem = { ...insertItem, id };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: string, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;

    const updatedItem = { ...item, ...updates };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  // Reservations
  async getReservations(): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const id = randomUUID();
    const reservation: Reservation = {
      ...insertReservation,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.reservations.set(id, reservation);
    return reservation;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }
}

export const storage = new MemStorage();
