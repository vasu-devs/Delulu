export interface Transaction {
  merchant: string;
  amount: number;
  transaction_type: "DEBIT" | "CREDIT";
  category: "Food" | "Travel" | "Shopping" | "Bills" | "Utilities" | "Subscription" | "UPI-Transfer" | "Vice" | "Income" | "Cashback" | "Verification" | "Other";
  is_impulsive: boolean;
  original_text: string;
}

export interface AnalysisResult {
  transactions: Transaction[];
  financial_health_score: number;
}
