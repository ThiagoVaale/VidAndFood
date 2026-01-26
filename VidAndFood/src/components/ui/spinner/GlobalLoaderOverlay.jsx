import WineGlassLoader from "./WineGlassLoader";

const GlobalLoaderOverlay = ({ loading, message }) => {
  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(250, 248, 246, 0.95)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <WineGlassLoader />
        <p
          style={{
            marginTop: "20px",
            fontSize: "16px",
            color: "#722f37",
            fontWeight: "500",
            letterSpacing: "0.5px",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default GlobalLoaderOverlay;
