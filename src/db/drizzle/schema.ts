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
  avatarPath: text("avatar_path"),
  name: text("name"),
});
// END OF USERS

// SCHOOLS
export const schools = pgTable("schools", {
  id: smallint("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  address: text("address"),
  imagePath: text("image_path"),
  isPremium: boolean("is_premium").notNull().default(false),
  premiumExpiresAt: timestamp("premium_expires_at"),
  fieldLocation: text("field_location"),
  phone: text("phone"),
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
// END OF SCHOOLS

// LOCATION
export const countries = pgTable("_countries", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  iso3: text("iso3").notNull(),
  iso2: text("iso2").notNull(),
  numericCode: text("numeric_code").notNull(),
  phoneCode: text("phone_code").notNull(),
  capital: text("capital"),
  currency: text("currency"),
  currencyName: text("currency_name"),
  currencySymbol: text("currency_symbol"),
  tld: text("tld"),
  native: text("native"),
  region: text("region"),
  regionId: bigint("region_id", { mode: "number" }),
  subregion: text("subregion"),
  subregionId: bigint("subregion_id", { mode: "number" }),
  nationality: text("nationality"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  emoji: text("emoji"),
  emojiU: text("emojiu"),
});

export const states = pgTable("_states", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  countryId: bigint("country_id", { mode: "number" })
    .references(() => countries.id)
    .notNull(),
  countryCode: text("country_code"),
  stateCode: text("state_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

export const cities = pgTable("_cities", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  stateId: bigint("state_id", { mode: "number" })
    .references(() => states.id)
    .notNull(),
  stateCode: text("state_code"),
  countryId: bigint("country_id", { mode: "number" })
    .references(() => countries.id)
    .notNull(),
  countryCode: text("country_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
});
// END OF LOCATION
