export interface AgendaItem {
    id: string;
    date: string;       // Format YYYY-MM-DD
    location: string;
    hostId: string;     // Reference ke ID Member
    hostName: string;   // Denormalisasi nama untuk mempermudah display
    period: number;     // 1, 2, 3...
    note?: string;
    createdAt?: any;
  }