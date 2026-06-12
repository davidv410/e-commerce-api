//id, name, email, password, role, createdAt
import { pgTable, pgEnum, serial, varchar, timestamp, numeric, text, integer } from 'drizzle-orm/pg-core'

export const rolesEnum = pgEnum('roles', ["admin", "user"])

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: rolesEnum('role').notNull().default("user"),
    createdAt: timestamp('created_at').defaultNow(),
    refreshToken: varchar('refresh_token', { length: 500 })
})

export const product = pgTable('product', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    description: text('description'),
    stock: integer("stock").notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
    userId: integer('user_id').references(() => users.id)
})

export const productImages = pgTable('product_images', {
    id: serial('id').primaryKey(),
    imageUrl: varchar('image_url', { length: 500 }).notNull(),
    productId: integer('product_id').notNull().references(() => product.id, { onDelete: 'cascade' })
})

export const cart = pgTable('cart', {
    id: serial('id').primaryKey(),
    userId: integer('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow()
})

export const cartItems = pgTable('cart_items', {
    id: serial('id').primaryKey(),
    cartId: integer('cart_id').notNull().references(() => cart.id, { onDelete: 'cascade' }),
    productId: integer('product_id').notNull().references(() => product.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull().default(0)
})