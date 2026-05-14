export interface Store {
  id: string;
  name: string;
  categoryIds: string[];
  areaId: string;
  address: string;
  mapLink?: string;
  isActive?: boolean;
  createdAt: any;
  updatedAt: any;
  creatorId: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: any;
  order: number;
}

export interface Area {
  id: string;
  name: string;
  createdAt: any;
  order: number;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}
