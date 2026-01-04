export interface Transaction {
  merchant: string;
  amount: number;
  category: "Food" | "Travel" | "Shopping" | "Bills" | "UPI-Transfer" | "Vice" | "Other";
  is_impulsive: boolean;
  original_text: string;
}

export interface AnalysisResult {
  transactions: Transaction[];
  financial_health_score: number;
}
