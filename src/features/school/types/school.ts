export interface School {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  address: string | null;
  imagePath: string | null;
  isPremium: boolean;
  premiumExpiresAt: Date | null;
  fieldLocation: string | null;
  phone: string | null;
}

export interface SchoolWithImageUrl extends School {
  imageUrl?: string;
}
