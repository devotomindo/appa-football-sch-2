import {
  bigint,
  boolean,
  jsonb,
  pgSchema,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Auth Schema
 */
export const authSchema = pgSchema("auth");

export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  rawAppMetaData: jsonb("raw_app_meta_data"),
  rawUserMetaData: jsonb("raw_user_meta_data"),
});

/**
 * Public Schema
 */
// USERS
export const userRoles = pgTable("user_roles", {
  id: smallint("id").primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  avatar_path: text("avatar_path"),
  name: text("name"),
});

// SCHOOLS
export const schools = pgTable("schools", {
  id: smallint("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  address: text("address"),
  image_path: text("image_path"),
  isPremium: boolean("is_premium").notNull().default(false),
  premiumExpiresAt: timestamp("premium_expires_at"),
});

export const schoolRoles = pgTable("school_roles", {
  id: smallint("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const schoolRoleMembers = pgTable("school_role_members", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id),
  schoolId: smallint("school_id")
    .notNull()
    .references(() => schools.id),
  schoolRoleId: smallint("school_role_id")
    .notNull()
    .references(() => schoolRoles.id),
});

export const userRoleMembers = pgTable("user_role_members", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id),
  userRoleId: smallint("user_role_id")
    .notNull()
    .references(() => userRoles.id),
});
// END OF USERS

export const trainingProcedure = pgTable("training_procedure", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
  tools: text("tools").array().notNull(),
  procedure: text("procedure").array().notNull(),
  minFieldSize: text("min_field_size"),
  videoPath: text("video_path").notNull(),
  groupSize: bigint("group_size", { mode: "number" }).notNull(),
  description: text("description").notNull(),
});
