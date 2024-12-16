import React from "react";
import Chat from "./components/Chat";

export default function Page({ params }) {
  const id = decodeURIComponent(params.id);

  return (
    <div>
      {id}

      <Chat id={id} />
    </div>
  );
}
