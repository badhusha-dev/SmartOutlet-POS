// Recipe and Raw Materials Types

export interface RawMaterial {
  id: number;
  materialCode: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  unitOfMeasure: UnitOfMeasure;
  baseUnitCost: number;
  currentStock: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  leadTimeDays: number;
  shelfLifeDays?: number;
  storageTemperatureMin?: number;
  storageTemperatureMax?: number;
  storageConditions?: string;
  primaryVendor?: VendorSummary;
  allergenInfo?: string;
  nutritionalInfo?: string;
  originCountry?: string;
  certifications?: string;
  wastagePercentage: number;
  status: MaterialStatus;
  lastPurchaseDate?: string;
  lastPurchaseCost?: number;
  averageCost?: number;
  imageUrl?: string;
  barcode?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Calculated fields
  stockValue: number;
  isLowStock: boolean;
  needsReorder: boolean;
  isExpired: boolean;
  daysUntilReorderNeeded: number;
  stockStatusColor: string;
}

export interface Recipe {
  id: number;
  productId: number;
  productName?: string;
  recipeCode: string;
  name: string;
  description?: string;
  version: number;
  batchSize: number;
  batchUnit: UnitOfMeasure;
  yieldPercentage: number;
  preparationTimeMinutes?: number;
  cookingTimeMinutes?: number;
  totalTimeMinutes?: number;
  difficultyLevel: number;
  servingSize?: number;
  servingUnit?: UnitOfMeasure;
  allergenInfo?: string;
  nutritionalInfo?: string;
  dietaryRestrictions?: string;
  cookingInstructions?: string;
  storageInstructions?: string;
  shelfLifeHours?: number;
  temperatureRequirement?: string;
  status: RecipeStatus;
  costPerBatch?: number;
  costPerServing?: number;
  laborCostPerBatch?: number;
  overheadCostPerBatch?: number;
  totalCostPerBatch?: number;
  imageUrl?: string;
  videoUrl?: string;
  tags?: string;
  notes?: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  createdBy?: UserSummary;
  approvedBy?: UserSummary;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Calculated fields
  materialCost: number;
  costPerUnit: number;
  statusColor: string;
  isActive: boolean;
  isApproved: boolean;
}

export interface RecipeIngredient {
  id?: number;
  rawMaterial: RawMaterialSummary;
  quantity: number;
  unit: UnitOfMeasure;
  stepNumber: number;
  preparationMethod?: string;
  notes?: string;
  isOptional: boolean;
  substituteIngredients?: string;
  unitCost: number;
  totalCost: number;
  wastagePercentage?: number;
  effectiveQuantity: number;
  allergenContribution?: string;
  processingInstructions?: string;
  qualityStandards?: string;
  costPercentageOfRecipe: number;
}

export interface RecipeStep {
  id?: number;
  stepNumber: number;
  title: string;
  description: string;
  durationMinutes?: number;
  temperature?: string;
  equipment?: string;
  tips?: string;
  imageUrl?: string;
  isCritical: boolean;
}

export interface Vendor {
  id: number;
  vendorCode: string;
  name: string;
  legalName?: string;
  description?: string;
  vendorType: VendorType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  taxId?: string;
  businessLicense?: string;
  paymentTerms?: string;
  creditLimit?: number;
  currentBalance: number;
  discountPercentage?: number;
  leadTimeDays: number;
  minimumOrderValue?: number;
  deliveryCharges?: number;
  qualityRating?: number;
  deliveryRating?: number;
  serviceRating?: number;
  overallRating?: number;
  certifications?: string;
  specialties?: string;
  preferredDeliveryDays?: string;
  deliveryTimeFrom?: string;
  deliveryTimeTo?: string;
  status: VendorStatus;
  notes?: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalOrderValue: number;
  materialsSupplied?: string[];
  createdAt: string;
  updatedAt: string;
}

// Summary/Reference types
export interface VendorSummary {
  id: number;
  vendorCode: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  leadTimeDays: number;
  qualityRating?: number;
  overallRating?: number;
}

export interface RawMaterialSummary {
  id: number;
  materialCode: string;
  name: string;
  category: string;
  unitOfMeasure: UnitOfMeasure;
  baseUnitCost: number;
  currentStock: number;
  imageUrl?: string;
}

export interface UserSummary {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Enums
export enum UnitOfMeasure {
  // Weight units
  KILOGRAM = 'KILOGRAM',
  GRAM = 'GRAM',
  POUND = 'POUND',
  OUNCE = 'OUNCE',
  
  // Volume units
  LITER = 'LITER',
  MILLILITER = 'MILLILITER',
  GALLON = 'GALLON',
  QUART = 'QUART',
  PINT = 'PINT',
  CUP = 'CUP',
  TABLESPOON = 'TABLESPOON',
  TEASPOON = 'TEASPOON',
  
  // Count units
  PIECE = 'PIECE',
  DOZEN = 'DOZEN',
  PACK = 'PACK',
  BOTTLE = 'BOTTLE',
  CAN = 'CAN',
  BOX = 'BOX',
  BAG = 'BAG',
  
  // Length units
  METER = 'METER',
  CENTIMETER = 'CENTIMETER',
  INCH = 'INCH',
  FOOT = 'FOOT'
}

export enum MaterialStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  RECALLED = 'RECALLED'
}

export enum RecipeStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED'
}

export enum VendorType {
  SUPPLIER = 'SUPPLIER',
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  WHOLESALER = 'WHOLESALER',
  FARMER = 'FARMER',
  IMPORTER = 'IMPORTER',
  LOCAL_PRODUCER = 'LOCAL_PRODUCER',
  ORGANIC_SUPPLIER = 'ORGANIC_SUPPLIER',
  SPECIALTY_SUPPLIER = 'SPECIALTY_SUPPLIER'
}

export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLACKLISTED = 'BLACKLISTED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ARCHIVED = 'ARCHIVED'
}

// Request/Form types
export interface RawMaterialCreateRequest {
  materialCode: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  unitOfMeasure: UnitOfMeasure;
  baseUnitCost: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  leadTimeDays?: number;
  shelfLifeDays?: number;
  storageTemperatureMin?: number;
  storageTemperatureMax?: number;
  storageConditions?: string;
  primaryVendorId?: number;
  allergenInfo?: string;
  nutritionalInfo?: string;
  originCountry?: string;
  certifications?: string;
  wastagePercentage?: number;
  imageUrl?: string;
  barcode?: string;
  internalNotes?: string;
}

export interface RecipeCreateRequest {
  productId: number;
  recipeCode: string;
  name: string;
  description?: string;
  batchSize: number;
  batchUnit: UnitOfMeasure;
  yieldPercentage?: number;
  preparationTimeMinutes?: number;
  cookingTimeMinutes?: number;
  difficultyLevel?: number;
  servingSize?: number;
  servingUnit?: UnitOfMeasure;
  allergenInfo?: string;
  nutritionalInfo?: string;
  dietaryRestrictions?: string;
  cookingInstructions?: string;
  storageInstructions?: string;
  shelfLifeHours?: number;
  temperatureRequirement?: string;
  laborCostPerBatch?: number;
  overheadCostPerBatch?: number;
  imageUrl?: string;
  videoUrl?: string;
  tags?: string;
  notes?: string;
  ingredients: RecipeIngredientRequest[];
  steps: RecipeStepRequest[];
}

export interface RecipeIngredientRequest {
  rawMaterialId: number;
  quantity: number;
  unit: UnitOfMeasure;
  stepNumber?: number;
  preparationMethod?: string;
  notes?: string;
  isOptional?: boolean;
  substituteIngredients?: string;
  wastagePercentage?: number;
  processingInstructions?: string;
  qualityStandards?: string;
}

export interface RecipeStepRequest {
  stepNumber: number;
  title: string;
  description: string;
  durationMinutes?: number;
  temperature?: string;
  equipment?: string;
  tips?: string;
  imageUrl?: string;
  isCritical?: boolean;
}

// Filter types
export interface RawMaterialFilters {
  category?: string;
  status?: MaterialStatus;
  vendorId?: number;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface RecipeFilters {
  productId?: number;
  status?: RecipeStatus;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Analysis types
export interface MaterialForecast {
  productId: number;
  forecastPeriodDays: number;
  expectedSalesQuantity: number;
  materialRequirements: MaterialRequirement[];
  totalEstimatedCost: number;
  recommendedOrders: RecommendedOrder[];
}

export interface MaterialRequirement {
  materialId: number;
  materialName: string;
  requiredQuantity: number;
  unit: string;
}

export interface RecommendedOrder {
  vendorId: number;
  vendorName: string;
  materials: string[];
}

export interface VendorReorderPlan {
  vendorId: number;
  vendorName: string;
  planningHorizonDays: number;
  recommendedOrders: ReorderRecommendation[];
  totalEstimatedCost: number;
  minimumOrderValue: number;
  meetsMinimumOrder: boolean;
}

export interface ReorderRecommendation {
  materialId: number;
  materialName: string;
  currentStock: number;
  reorderPoint: number;
  recommendedQuantity: number;
  unit: string;
  estimatedCost: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expectedDeliveryDate: string;
}

export interface RecipeCostAnalysis {
  recipeId: number;
  batchQuantity: number;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  costPerUnit: number;
  profitMargin: number;
  suggestedSellingPrice: number;
}

// Unit of measure metadata
export interface UnitOfMeasureInfo {
  value: string;
  symbol: string;
  displayName: string;
  category: string;
}