import { HomeWrapper } from "@/components/HomeWrapper";
import { Tender } from "@/types";

export default async function Home() {

  const res = await fetch('http://localhost:5000/api/data', {
    method: 'GET',
    headers: {
      "Content-Type": 'application/json'
    }
  });
  const data: Tender[] = await res.json();

  return (
    <HomeWrapper tenders={data} />
  );
}
