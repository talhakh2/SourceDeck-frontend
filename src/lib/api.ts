import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface Product {
  _id: string;
  title: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  previewData: {
    kpiSummary: {
      roiPercentage: number;
      estimatedCost: number;
      revenueForecast: number;
    };
  };
  fullData?: {
    detailedAnalysis: any;
    sourcingStrategy: any;
    marketResearch: any;
    competitorAnalysis: any;
    detailedKpis: {
      profitMargin: number;
      paybackPeriod: number;
      breakEvenPoint: number;
      marketSize: number;
      competitionLevel: number;
    };
    launchPlan: string;
    marketingStrategy: string;
    riskAssessment: string;
    supplierContacts: any[];
    productImages: string[];
    legalConsiderations: string;
    additionalNotes: string;
  };
  sellerId: {
    _id: string;
    name: string;
    profile: {
      company?: string;
      bio?: string;
      location?: string;
      website?: string;
    };
    verification?: {
      emailVerified: boolean;
      phoneVerified: boolean;
      identityVerified: boolean;
      businessVerified: boolean;
    };
  };
  views: number;
  purchaseCount: number;
  wishlistCount?: number;
  shareCount?: number;
  rating?: {
    average: number;
    count: number;
  };
  tags: string[];
  createdAt: string;
  publishedAt?: string;
  pdfUrl?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRoi?: number;
  maxRoi?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add JWT token (unified authentication) - only if not already set
    if (typeof window !== 'undefined' && !(config.headers as any)?.Authorization) {
      // Get JWT token from localStorage (unified authentication)
      const jwtToken = localStorage.getItem('authToken');
      if (jwtToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${jwtToken}`,
        };
      }
    }

    try {
      console.log('Making API request to:', url);
      console.log('Request headers:', config.headers);
      console.log('Request body:', config.body);
      
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log('API response status:', response.status);
      console.log('API response data:', data);

      if (!response.ok) {
        // Return the error response instead of throwing
        return {
          success: false,
          message: data.message || 'Request failed',
          errors: data.errors || []
        } as ApiResponse<T>;
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      // Return error response instead of throwing
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
        errors: []
      } as ApiResponse<T>;
    }
  }

  // Products API
  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    return this.request<PaginatedResponse<Product>>(`/products?${params.toString()}`);
  }

  async getProduct(id: string): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>(`/products/${id}`);
  }

  async searchProducts(query: string, filters: ProductFilters = {}): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams({ q: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    return this.request<PaginatedResponse<Product>>(`/products/search?${params.toString()}`);
  }

  async createProduct(productData: any): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  // Auth API - Firebase integration
  async createUser(userData: {
    uid: string;
    name: string;
    email: string;
    role: 'Buyer' | 'Seller';
    emailVerified: boolean;
    profile?: any;
  }): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>('/auth/firebase/create-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Auth API - Manual authentication
  async registerManual(userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'Buyer' | 'Seller';
  }): Promise<ApiResponse<{ user: any; emailSent: boolean }>> {
    // Convert role to lowercase for backend compatibility
    const backendData = {
      ...userData,
      role: userData.role.toLowerCase()
    };
    return this.request<{ user: any; emailSent: boolean }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async loginManual(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>(`/auth/verify/${token}`, {
      method: 'GET',
    });
  }

  async completeRegistration(role: 'Buyer' | 'Seller', profileData?: any): Promise<ApiResponse<{ user: any; token: string }>> {
    // This endpoint doesn't exist in backend, we'll handle role selection differently
    return this.request<{ user: any; token: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ role: role.toLowerCase(), ...profileData }),
    });
  }

  async resendVerificationEmail(email: string): Promise<ApiResponse<{}>> {
    return this.request<{}>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<{}>> {
    return this.request<{}>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string, confirmPassword: string): Promise<ApiResponse<{}>> {
    return this.request<{}>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password, confirmPassword }),
    });
  }

  // Auth API - Firebase authentication
  async registerFirebase(firebaseUser: any, role: 'Buyer' | 'Seller', profileData?: any): Promise<ApiResponse<{ user: any; token: string }>> {
    // Get the Firebase ID token
    const idToken = await firebaseUser.getIdToken();
    
    return this.request<{ user: any; token: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken, role: role.toLowerCase(), profile: profileData }),
    });
  }

  async loginFirebase(firebaseUser: any): Promise<ApiResponse<{ user: any; token: string }>> {
    // Get the Firebase ID token
    const idToken = await firebaseUser.getIdToken();
    
    return this.request<{ user: any; token: string }>('/auth/google/verify', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  // Legacy auth methods (kept for compatibility)
  async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'Buyer' | 'Seller';
    profile?: any;
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User API
  async getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>('/auth/me');
  }

  // Stats API (for homepage)
  async getStats(): Promise<ApiResponse<{
    totalProducts: number;
    totalUsers: number;
    totalPurchases: number;
    averageROI: number;
  }>> {
    return this.request<{
      totalProducts: number;
      totalUsers: number;
      totalPurchases: number;
      averageROI: number;
    }>('/stats');
  }

  // Purchase API
  async createPurchase(purchaseData: {
    productId: string;
    amount: number;
    paymentProvider: string;
    paymentProviderTransactionId: string;
  }): Promise<ApiResponse<{ purchase: any }>> {
    return this.request<{ purchase: any }>('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    });
  }

  async verifyAccess(productId: string): Promise<ApiResponse<{ hasAccess: boolean }>> {
    return this.request<{ hasAccess: boolean }>('/purchases/verify-access', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async getSellerStats(): Promise<ApiResponse<{ stats: any }>> {
    return this.request<{ stats: any }>('/purchases/stats/seller');
  }

  async getMyPurchases(): Promise<ApiResponse<{ purchases: any[] }>> {
    return this.request<{ purchases: any[] }>('/purchases/my-purchases');
  }

  // Cart API
  async getCart(): Promise<ApiResponse<{ cart: any }>> {
    return this.request<{ cart: any }>('/cart');
  }

  async addToCart(productId: string): Promise<ApiResponse<{ cart: any }>> {
    return this.request<{ cart: any }>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  }


  async removeFromCart(productId: string): Promise<ApiResponse<{ cart: any }>> {
    return this.request<{ cart: any }>(`/cart/items/${productId}`, {
      method: 'DELETE'
    });
  }

  async clearCart(): Promise<ApiResponse<{ cart: any }>> {
    return this.request<{ cart: any }>('/cart', {
      method: 'DELETE'
    });
  }

  async syncCart(items: any[]): Promise<ApiResponse<{ cart: any }>> {
    return this.request<{ cart: any }>('/cart/sync', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
  }

  // User Profile API
  async updateProfile(profileData: any): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};
