import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReservationSchema, insertOrderSchema, insertMenuItemSchema } from "@shared/schema";
import authRouter, { requireAuth, requireRole } from "./auth";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'attached_assets', 'menu_images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'menu-item-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.use("/api/auth", authRouter);

  // Configuration endpoint for frontend
  app.get("/api/config", (req, res) => {
    res.json({
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    });
  });

  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Menu items endpoints
  app.get("/api/menu-items", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const item = await storage.getMenuItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  });

  app.post("/api/menu-items", requireRole("owner"), upload.single('image'), async (req, res) => {
    try {
      const file = req.file;
      const imageUrl = file ? `/attached_assets/menu_images/${file.filename}` : null;

      const validatedData = insertMenuItemSchema.parse({
        ...req.body,
        imageUrl,
      });

      const menuItem = await storage.createMenuItem(validatedData);
      res.status(201).json(menuItem);
    } catch (error: any) {
      console.error("Error creating menu item:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid menu item data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  app.patch("/api/menu-items/:id", requireRole("owner"), upload.single('image'), async (req, res) => {
    try {
      const updates: any = { ...req.body };
      
      if (req.file) {
        updates.imageUrl = `/attached_assets/menu_images/${req.file.filename}`;
      }

      const updatedItem = await storage.updateMenuItem(req.params.id, updates);
      if (!updatedItem) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });

  app.delete("/api/menu-items/:id", requireRole("owner"), async (req, res) => {
    try {
      const deleted = await storage.deleteMenuItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  // Reservations endpoints
  app.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await storage.getReservations();
      res.json(reservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  });

  app.post("/api/reservations", async (req, res) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      const reservation = await storage.createReservation(validatedData);
      res.status(201).json(reservation);
    } catch (error: any) {
      console.error("Error creating reservation:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid reservation data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create reservation" });
    }
  });

  // Orders endpoints
  app.get("/api/orders", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let orders;
      if (user.role === "owner") {
        // Owner sees all orders
        orders = await storage.getOrders();
      } else if (user.role === "livreur") {
        // Livreur sees pending orders + their assigned orders
        const pendingOrders = await storage.getPendingOrders();
        const assignedOrders = await storage.getOrdersByLivreur(user.id);
        
        // Combine and remove duplicates
        const orderMap = new Map();
        [...pendingOrders, ...assignedOrders].forEach(order => {
          orderMap.set(order.id, order);
        });
        orders = Array.from(orderMap.values());
      } else {
        orders = await storage.getOrdersByUser(user.id);
      }

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId: userId || null,
      });
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error creating order:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (user.role === "livreur" || user.role === "owner") {
        const updates: any = { updatedAt: new Date() };
        
        // Handle status updates
        if (req.body.status) {
          updates.status = req.body.status;
          
          // If confirming order and it's a livreur, assign them
          if (req.body.status === 'confirmed' && user.role === "livreur" && !order.livreurId) {
            updates.livreurId = user.id;
          }
        }

        const updatedOrder = await storage.updateOrder(req.params.id, updates);
        return res.json(updatedOrder);
      }

      return res.status(403).json({ error: "Not authorized to update orders" });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  app.get("/api/users", requireRole("owner"), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users/create-staff", requireRole("owner"), async (req: any, res) => {
    try {
      const { email, password, name, phone, role } = req.body;

      if (!email || !password || !name || !role) {
        return res.status(400).json({ error: 'Email, password, name, and role are required' });
      }

      if (!['owner', 'livreur'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be owner or livreur' });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role,
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating staff user:", error);
      res.status(500).json({ error: "Failed to create staff user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
