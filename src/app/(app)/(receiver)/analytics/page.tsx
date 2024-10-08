"use client";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Skeleton } from "@/components/ui/skeleton";
import BarChartRatings from "./bar-ratings-chart";
import PieChartMessageCount from "./pie-chart-message-count";
import { useMessageContext } from "../MessageProvider";

type Props = {};

const Page = (props: Props) => {
  const [ratingsObject, setRatingsObject] = useState({
    "1star": 0,
    "2star": 0,
    "3star": 0,
    "4star": 0,
    "5star": 0,
  });
  const [ratingsArray, setRatingsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const { messageCount, maxMessages } = useMessageContext();

  const fetchRatings = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/get-ratings");
      const ratingsData = res.data.ratings.reduce((acc: any, item: any) => {
        acc[item.stars] = (acc[item.stars] || 0) + 1;
        return acc;
      }, {});

      setRatingsObject({
        "1star": ratingsData["1star"] || 0,
        "2star": ratingsData["2star"] || 0,
        "3star": ratingsData["3star"] || 0,
        "4star": ratingsData["4star"] || 0,
        "5star": ratingsData["5star"] || 0,
      });

      setRatingsArray(res.data.ratings);

      if (refresh) {
        toast({
          title: "Refreshed messages",
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchRatings();
  }, [session, fetchRatings]);

  return (
    <section className="container py-8 min-h-screen">
      <div className="grid grid-cols-2 gap-4 pb-8">
        <PieChartMessageCount messageCount={messageCount} maxMessages={maxMessages} />
        {isLoading ? (
          <Skeleton className="bg-slate-200" />
        ) : (
          <BarChartRatings
            oneStar={ratingsObject["1star"]}
            twoStar={ratingsObject["2star"]}
            threeStar={ratingsObject["3star"]}
            fourStar={ratingsObject["4star"]}
            fiveStar={ratingsObject["5star"]}
          />
        )}
      </div>
    </section>
  );
};

export default Page;
