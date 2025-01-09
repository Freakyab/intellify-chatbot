import React from "react";
import Tutorial1 from "./tutorial1";
import Tutorial2 from "./tutorial2";
import Tutorial3 from "./tutorial3";
import Complete from "./complete";

function AllTutorial({
  action,
  setAction,
}: {
  action: number;
  setAction: (action: number) => void;
}) {
  console.log(action, "action");
  return (
    <div>
      {action === 1 && <Tutorial1 setAction={setAction} />}
      {action === 2 && <Tutorial2 setAction={setAction} />}
      {action === 3 && <Tutorial3 setAction={setAction} />}
      {action === 4 && <Complete setAction={setAction} />}
    </div>
  );
}

export default AllTutorial;
