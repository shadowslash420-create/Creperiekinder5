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

    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    const categoriesData: Category[] = [
      {
        id: "crepe",
        name: "Crêpe",
        description: "Délicieuses crêpes artisanales",
        order: 1,
      },
      {
        id: "cheesecake",
        name: "Cheesecake",
        description: "Cheesecakes onctueux et savoureux",
        order: 2,
      },
      {
        id: "donuts",
        name: "Donuts",
        description: "Donuts moelleux et gourmands",
        order: 3,
      },
      {
        id: "mini-pancakes",
        name: "Mini-Pancakes",
        description: "Mini-pancakes délicieux",
        order: 4,
      },
      {
        id: "boissons-fraiches",
        name: "Boissons Fraîches",
        description: "Jus de fruits frais",
        order: 5,
      },
      {
        id: "boissons-chaudes",
        name: "Boissons Chaudes",
        description: "Café, thé et boissons chaudes",
        order: 6,
      },
    ];

    categoriesData.forEach(category => {
      this.categories.set(category.id, category);
    });

    const menuItemsData: MenuItem[] = [
      { id: randomUUID(), name: "Guermeche", description: "Crêpe Guermeche", price: "250", categoryId: "crepe", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Chocolat", description: "Crêpe au chocolat", price: "250", categoryId: "crepe", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Pistache", description: "Crêpe à la pistache", price: "250", categoryId: "crepe", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Nutela", description: "Crêpe au Nutella", price: "400", categoryId: "crepe", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Lotus", description: "Crêpe au Lotus", price: "400", categoryId: "crepe", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Kinder", description: "Crêpe au Kinder", price: "700", categoryId: "crepe", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Pasta", description: "Crêpe Pasta", price: "300", categoryId: "crepe", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Farsi", description: "Crêpe Farsi", price: "500", categoryId: "crepe", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Sushi", description: "Crêpe Sushi", price: "350", categoryId: "crepe", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Mordjan", description: "Crêpe Mordjan", price: "400", categoryId: "crepe", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Willy", description: "Crêpe Willy", price: "300", categoryId: "crepe", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Dubai", description: "Crêpe Dubai", price: "700", categoryId: "crepe", imageUrl: null, available: true, popular: true },

      { id: randomUUID(), name: "Bueno", description: "Cheesecake Bueno", price: "500", categoryId: "cheesecake", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Fraise", description: "Cheesecake à la fraise", price: "500", categoryId: "cheesecake", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Citron", description: "Cheesecake au citron", price: "500", categoryId: "cheesecake", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Oreo", description: "Cheesecake Oreo", price: "500", categoryId: "cheesecake", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Lotus", description: "Cheesecake Lotus", price: "500", categoryId: "cheesecake", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Dubai", description: "Cheesecake Dubai", price: "600", categoryId: "cheesecake", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "San Sebastian", description: "Cheesecake San Sebastian", price: "500", categoryId: "cheesecake", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Framboise", description: "Cheesecake à la framboise", price: "500", categoryId: "cheesecake", imageUrl: null, available: true, popular: false },

      { id: randomUUID(), name: "Chocolat", description: "Donut au chocolat", price: "300", categoryId: "donuts", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Miel-Caramel", description: "Donut miel-caramel", price: "300", categoryId: "donuts", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Banane", description: "Donut à la banane", price: "400", categoryId: "donuts", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Fruit", description: "Donut aux fruits", price: "450", categoryId: "donuts", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Kinder", description: "Donut Kinder", price: "700", categoryId: "donuts", imageUrl: null, available: true, popular: true },

      { id: randomUUID(), name: "Choco", description: "Mini-pancakes au chocolat", price: "300", categoryId: "mini-pancakes", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Miel-Caramel", description: "Mini-pancakes miel-caramel", price: "300", categoryId: "mini-pancakes", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Banane", description: "Mini-pancakes à la banane", price: "400", categoryId: "mini-pancakes", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Fruit", description: "Mini-pancakes aux fruits", price: "450", categoryId: "mini-pancakes", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Kinder", description: "Mini-pancakes Kinder", price: "700", categoryId: "mini-pancakes", imageUrl: null, available: true, popular: true },

      { id: randomUUID(), name: "Jus Banane", description: "Jus de banane frais", price: "300", categoryId: "boissons-fraiches", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Jus Orange", description: "Jus d'orange frais", price: "300", categoryId: "boissons-fraiches", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Jus Fraise", description: "Jus de fraise frais", price: "300", categoryId: "boissons-fraiches", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Jus Kiwi", description: "Jus de kiwi frais", price: "300", categoryId: "boissons-fraiches", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Jus Citron", description: "Jus de citron frais", price: "300", categoryId: "boissons-fraiches", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Jus Pêche", description: "Jus de pêche frais", price: "300", categoryId: "boissons-fraiches", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Jus Grenadine", description: "Jus de grenadine frais", price: "300", categoryId: "boissons-fraiches", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Jus Cocktail", description: "Jus cocktail de fruits", price: "300", categoryId: "boissons-fraiches", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Jus Ananas", description: "Jus d'ananas frais", price: "300", categoryId: "boissons-fraiches", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Pink Lady", description: "Pink Lady", price: "450", categoryId: "boissons-fraiches", imageUrl: null, available: true, popular: true },

      { id: randomUUID(), name: "Café", description: "Café", price: "150", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Café au Lait", description: "Café au lait", price: "200", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Café Days", description: "Café Days", price: "150", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Thé Citron", description: "Thé au citron", price: "150", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Thé Pomme", description: "Thé à la pomme", price: "150", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Nescafé", description: "Nescafé", price: "150", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Lipton", description: "Lipton", price: "150", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Choco Chaud", description: "Chocolat chaud", price: "300", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: true },
      { id: randomUUID(), name: "Lavazza", description: "Café Lavazza", price: "200", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Lof", description: "Lof", price: "200", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: false },
      { id: randomUUID(), name: "Espresso", description: "Espresso", price: "200", categoryId: "boissons-chaudes", imageUrl: null, available: true, popular: true },
    ];

    menuItemsData.forEach(item => {
      this.menuItems.set(item.id, item);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = insertCategory.name.toLowerCase().replace(/\s+/g, '-');
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

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
