export type Order = {
    _id: string;
    user: string;
    address: string;
    phone: string;
    name: string;
    payment: string;
    totalPrice: number;
    status: string; 
    products: Array<{
      product: string;
      quantity: number;
    }>;
  };
  