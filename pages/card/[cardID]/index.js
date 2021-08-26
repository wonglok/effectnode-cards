import { useEffect } from "react";
import router from "next/router";

function Diamond(children) {
  return children;
}

//
export async function getServerSideProps(context) {
  let cardID = context?.query?.cardID || null;

  if (!cardID) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      cardID,
    },
  };
}

//

export default function CARDID({ cardID }) {
  //
  useEffect(() => {
    router.push(`/card/${cardID}/verification`);
  }, []);

  return <div className="bg-blue-900"></div>;
}

//

//

//
