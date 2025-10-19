import { pgTable, text, varchar, decimal, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Menu Categories
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Menu Items
export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  imageUrl: text("image_url"),
  available: boolean("available").notNull().default(true),
  popular: boolean("popular").notNull().default(false),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

// Reservations
export const reservations = pgTable("reservations", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  partySize: integer("party_size").notNull(),
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  status: true,
  createdAt: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  partySize: z.coerce.number().min(1, "Party size must be at least 1").max(20, "Party size cannot exceed 20"),
});

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservations.$inferSelect;

// Orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  items: text("items").notNull(), // JSON string of order items
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  orderType: text("order_type").notNull(), // 'pickup' or 'delivery'
  deliveryAddress: text("delivery_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  status: true,
  createdAt: true,
}).extend({
  customerEmail: z.string().email("Please enter a valid email address"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
