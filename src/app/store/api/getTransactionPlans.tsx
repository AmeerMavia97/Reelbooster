import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TransactionPlan } from "@/app/types/Gift";
import Cookies from "js-cookie";

const fetchTransactionPlans = async (
  page: number
): Promise<TransactionPlan> => {
  const token = Cookies.get("Reelboost_auth_token");

  const { data } = await axios.post(
    `https://api.yeteneksat.com/api/transaction/get-transaction-plan`,
    { page }, // page goes in body
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data;
};

export const useTransactionPlans = (page: number) => {
  return useQuery<TransactionPlan>({
    queryKey: ["transactionPlans", page],
    queryFn: () => fetchTransactionPlans(page),
    // keepPreviousData: true, // prevents flicker when switching pages
    staleTime: 1000 * 60, 
  });
};
