export interface School {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  address: string | null;
  imagePath: string | null;
  isPremium: boolean;
  // premiumExpiresAt: Date | null;
  fieldLocation: string | null;
  phone: string | null;
  domisiliKota: number | null;
}

export interface SchoolWithImageUrl extends School {
  imageUrl?: string;
}
