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
  domisiliProvinsi: bigint("domisili_provinsi", { mode: "number" }).references(
    () => states.id,
  ),
  domisiliKota: bigint("domisili_kota", { mode: "number" }).references(
    () => cities.id,
  ),
});
// END OF USERS

// SCHOOLS
export const schools = pgTable("schools", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  address: text("address"),
  imagePath: text("image_path"),
  isPremium: boolean("is_premium").notNull().default(false),
  premiumExpiresAt: timestamp("premium_expires_at"),
  fieldLocation: text("field_location"),
  phone: text("phone"),
  domisiliKota: bigint("domisili_kota", { mode: "number" }).references(
    () => cities.id,
  ),
});

export const schoolRoles = pgTable("school_roles", {
  id: smallint("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const schoolRoleMembers = pgTable("school_role_members", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id),
  schoolRoleId: smallint("school_role_id")
    .notNull()
    .references(() => schoolRoles.id),
  isApproved: boolean("is_approved").notNull().default(false),
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

export const formationPositioning = pgTable("formation_positioning", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  formationId: uuid("formation_id").references(() => formations.id),
  positionId: uuid("position_id").references(() => positions.id),
  characteristics: text("characteristics").array(),
  offenseDescription: text("offense_description").array(),
  offenseIllustrationPath: text("offense_illustration_path"),
  defenseDescription: text("defense_description").array(),
  defenseIllustrationPath: text("defense_illustration_path"),
  positionNumber: smallint("position_number").notNull(),
});

export const formations = pgTable("formations", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name"),
  description: text("description"),
  defaultFormationImagePath: text("default_formation_image_path"),
  offenseTransitionImagePath: text("offense_transition_image_path"),
  defenseTransitionImagePath: text("defense_transition_image_path"),
});

export const positions = pgTable("positions", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
});
