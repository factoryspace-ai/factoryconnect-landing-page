import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  text,
  boolean,
  pgEnum,
  integer
} from "drizzle-orm/pg-core";

// Define access level enum
export const accessLevelEnum = pgEnum('access_level', ['admin', 'employee']);

export const msme = pgTable("Msme", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({length: 255}).notNull(),
  subdomain: varchar({ length: 63 }).unique(),
  createdAt: timestamp("created_at").defaultNow(),
  description: text("description"),
  address: text("address"),
  city: varchar({ length: 255 }),
  state: varchar({ length: 255 }),
  country: varchar({ length: 255 }),
  zipCode: varchar({ length: 255 }),
  contact_number: varchar({ length: 255 }),
  contact_email: varchar({ length: 255 }),
  year_established: varchar({ length: 255 }),
  working_hours: varchar({ length: 255 }),
  logo: text("logo"),
  industry: varchar({ length: 255 }),
  services: text("services"),
  ratings: integer("ratings"),
  pricing: text("pricing"),
  gst: varchar({ length: 255 }),
  isActive: boolean("is_active").notNull().default(false),
});


// user Schema
export const user = pgTable("User", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar({ length: 255 }).notNull().unique(),
  //   tenantId: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  username: varchar({ length: 255 }),
  firstName: varchar({ length: 255 }),
  lastName: varchar({ length: 255 }),
  emailVerified: boolean("email_verified").default(false),
  lastSignInAt: timestamp("last_sign_in_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

// Junction table for user-msme relationship with access level
export const userMsme = pgTable("UserMsme", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => user.id, { onDelete: "cascade" }),
  email: varchar({ length: 255 }).notNull().unique(),
  msmeId: uuid("msme_id")
    .notNull()
    .references(() => msme.id, { onDelete: "cascade" }),
  department: varchar({ length: 255 }).default(""),
  // accessLevel: accessLevelEnum("access_level").notNull().default('employee'),
  accessLevel: varchar({ length: 20 }).notNull().default('operator'),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  invitedBy: uuid("invited_by").references(() => user.id),
  status: varchar("status", { length: 20 }).notNull().default('active'),
});

export const msmeWaitingList = pgTable("MsmeWaitingList", {
  id: uuid("id").primaryKey().defaultRandom(),
  // msmeId: uuid("msme_id")
  //   .notNull()
  //   .references(() => msme.id, { onDelete: "cascade" }),
  // userId: uuid("user_id")
  //   .notNull()
  //   .references(() => user.id, { onDelete: "cascade" }),
  // subdomain: varchar("subdomain").notNull(),
  companyName: varchar("company_name").notNull(),
  email: varchar("email").notNull(),
  companyDetails: text("company_details").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
