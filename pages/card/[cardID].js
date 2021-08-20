import { useRouter } from "next/router";

//
//
export default function CardPage() {
  let { query } = useRouter();
  //

  return <div>Card Landing Page {query.cardID}</div>;
}

//
//

function CardContent() {
  return <div></div>;
}
