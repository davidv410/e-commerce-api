//id, name, email, password, role, createdAt
import { pgTable, pgEnum, serial, varchar, timestamp } from 'drizzle-orm/pg-core'

export const rolesEnum = pgEnum('roles', ["admin", "user"])

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: rolesEnum('role').notNull().default("user"),
    createdAt: timestamp('created_at').defaultNow()
})