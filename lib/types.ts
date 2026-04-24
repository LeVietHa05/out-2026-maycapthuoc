export interface Medicine {
  id: number;
  name: string;
  image: string;
  dosage: string;
  uses: string;
  pharmacology: string;
  indications: string;
  contraindications: string;
  sideEffects: string;
  interactions: string;
  warnings: string;
  overdoseHandling: string;
  price: number;
}

export interface Order {
  id: string;
  phone: string;
  medicines: Record<number, number>;
  total: number;
  timestamp: string;
  qrCode: string;
}

// Load medicines from JSON
export async function getMedicines(): Promise<Medicine[]> {
  try {
    const response = await fetch('/api/medicines');
    if (!response.ok) throw new Error('Failed to load medicines');
    return response.json();
  } catch (error) {
    console.error('Error loading medicines:', error);
    return [];
  }
}

// Load orders from JSON
export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch('/api/orders');
    if (!response.ok) throw new Error('Failed to load orders');
    return response.json();
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
}

// Save or update medicine to JSON file
export async function updateMedicine(medicine: Medicine): Promise<Medicine | null> {
  try {
    const response = await fetch('/api/medicines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicine),
    });
    if (!response.ok) throw new Error('Failed to save medicine');
    return response.json();
  } catch (error) {
    console.error('Error updating medicine:', error);
    return null;
  }
}

// Delete medicine from JSON file
export async function deleteMedicine(id: number): Promise<boolean> {
  try {
    const response = await fetch('/api/medicines', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting medicine:', error);
    return false;
  }
}

// Add order to JSON file
export async function addOrder(order: Order): Promise<Order | null> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to save order');
    return response.json();
  } catch (error) {
    console.error('Error adding order:', error);
    return null;
  }
}

// Delete order from JSON file
export async function deleteOrder(id: string): Promise<boolean> {
  try {
    const response = await fetch('/api/orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}
