import { Loader } from "@mantine/core";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        height: "70vh",
        width: "100%",
        minWidth: "80vw",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader
        style={{ display: "flex", justifyItems: "center" }}
        color="#1384e1"
        size="xl"
        type="bars"
      />
    </div>
  );
}
