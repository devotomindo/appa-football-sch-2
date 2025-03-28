import {
  bigint,
  boolean,
  date,
  doublePrecision,
  jsonb,
  numeric,
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
  birthDate: date("birth_date").notNull(),
  isMale: boolean("is_male").notNull(),
  bodyHeight: smallint("body_height").notNull(),
  bodyWeight: smallint("body_weight").notNull(),

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
  fieldLocation: text("field_location"),
  phone: text("phone"),
  domisiliKota: bigint("domisili_kota", { mode: "number" }).references(
    () => cities.id,
  ),
  isPremium: boolean("is_premium").notNull().default(false),
});

export const schoolRoles = pgTable("school_roles", {
  id: smallint("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const schoolRoleMembers = pgTable("school_role_members", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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

// Training Procedure
export const tools = pgTable("tools", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
  imagePath: text("image_path"),
});

export const trainingProcedure = pgTable("training_procedure", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
  procedure: text("procedure").array().notNull(),
  minFieldSize: text("min_field_size"),
  videoPath: text("video_path").notNull(),
  groupSize: bigint("group_size", { mode: "number" }).notNull(),
  description: text("description").notNull(),
});

export const trainingTools = pgTable("training_tools", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  trainingId: uuid("training_id").references(() => trainingProcedure.id),
  toolId: uuid("tool_id").references(() => tools.id),
  minCount: smallint("min_count").notNull(),
});

export const trainingProcedureAssignment = pgTable(
  "training_procedure_assignment",
  {
    id: uuid("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    studentId: uuid("student_id").references(() => schoolRoleMembers.id),
    trainingId: uuid("training_id").references(() => trainingProcedure.id),
  },
);

// End of Training Procedure

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
  principles: text("principles").array(),
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
  description: text("description").notNull(),
});

export const gradeMetrics = pgTable("grade_metrics", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  metric: text("metric").notNull(),
});

export const assessmentCategories = pgTable("assessment_categories", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  name: text("name").notNull(),
});

export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name"),
  description: text("description"),
  mainGoal: text("main_goal"),
  gradeMetricId: uuid("grade_metric_id").references(() => gradeMetrics.id),
  isHigherGradeBetter: boolean("is_higher_grade_better"),
  categoryId: bigint("category_id", { mode: "number" }).references(
    () => assessmentCategories.id,
  ),
});

export const assessmentIllustrations = pgTable("assessment_illustrations", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  assessmentId: uuid("assessment_id").references(() => assessments.id),
  imagePath: text("image_path").notNull(),
  procedure: text("procedure").notNull(),
  orderNumber: smallint("order_number").notNull(),
});

export const assessmentSessions = pgTable("assessment_sessions", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  assessmentId: uuid("assessment_id")
    .references(() => assessments.id)
    .notNull(),
  schoolId: uuid("school_id")
    .references(() => schools.id)
    .notNull(),
  completedAt: timestamp("completed_at"),
});

export const assessmentRecords = pgTable("assessment_records", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  assessmentSessionId: uuid("assessment_session_id")
    .references(() => assessmentSessions.id)
    .notNull(),
  studentId: uuid("student_id")
    .references(() => userProfiles.id)
    .notNull(),
  score: doublePrecision("score"),
});

export const assessmentTools = pgTable("assessment_tools", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  assessmentId: uuid("assessment_id").references(() => assessments.id),
  toolId: uuid("tool_id").references(() => tools.id),
  minCount: smallint("min_count").notNull(),
});

export const proPlayers = pgTable("pro_players", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  playersName: text("player_name"),
  age: bigint("age", { mode: "number" }),
  photoPath: text("photo_path"),
  positionId: uuid("position_id").references(() => positions.id),
  weight: bigint("weight", { mode: "number" }),
  height: bigint("height", { mode: "number" }),
  currentTeam: text("current_team"),
  countryId: bigint("country_id", { mode: "number" }).references(
    () => countries.id,
  ),
});

export const proPlayerAssessments = pgTable("pro_player_assessments", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  proPlayerId: uuid("pro_player_id").references(() => proPlayers.id),
  assessmentId: uuid("assessment_id").references(() => assessments.id),
  score: numeric("score"),
});

// Start of Transactions
export const packages = pgTable("packages", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
  price: bigint("price", { mode: "number" }).notNull(),
  description: text("description").notNull(),
  monthDuration: smallint("month_duration").notNull(),
  quotaAddition: smallint("quota_addition").notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  referrerId: uuid("referrer_id").references(() => authUsers.id),
  isActive: boolean("is_active").notNull().default(true),
  code: text("code").notNull(),
  commission: bigint("commission", { mode: "number" }).notNull(),
  discount: bigint("discount", {
    mode: "number",
  }).notNull(),
});

export const referralsPackagesAssignments = pgTable(
  "referrals_packages_assignments",
  {
    id: uuid("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    referralId: uuid("referral_id").references(() => referrals.id),
    packageId: uuid("package_id").references(() => packages.id),
  },
);

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .references(() => authUsers.id)
    .notNull(),
  packageId: uuid("package_id")
    .references(() => packages.id)
    .notNull(),
  referralId: uuid("referral_id").references(() => referrals.id),
  status: text("status").notNull(),
  paymentMethod: text("payment_method"),
  billedAmount: bigint("billed_amount", { mode: "number" }).notNull(),
  schoolId: uuid("school_id").references(() => schools.id),
  midtransToken: text("midtrans_token").notNull(),
});

export const studentPremiumAssignments = pgTable(
  "student_premium_assignments",
  {
    id: uuid("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    studentId: uuid("student_id").references(() => schoolRoleMembers.id),
    transactionId: uuid("transaction_id").references(() => transactions.id),
    deactivatedAt: timestamp("deactivated_at"),
  },
);
// End of Transactions
