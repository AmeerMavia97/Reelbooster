import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Cookies from 'js-cookie'

// API function
const fetchTransactionConf = async () => {
      const token = Cookies.get("Reelboost_auth_token");
    
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transaction/transaction_conf`,{
    transaction_type:"withdrawal"
  },
  {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
);
  return data;
};

// React Query hook
export const useTransactionConfQuery = () => {
  return useQuery({
    queryKey: ["transactionConf"],
    queryFn: fetchTransactionConf,
    staleTime: 1000 * 60 * 5, 
  });
};
