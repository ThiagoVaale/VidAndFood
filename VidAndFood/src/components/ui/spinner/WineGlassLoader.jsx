const WineGlassLoader = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        position: 'relative',
        width: '80px',
        height: '140px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          width: '70px',
          height: '85px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)',
          borderRadius: '0 0 35px 35px',
          border: '3px solid #8B4513',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(139, 69, 19, 0.1)'
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(to top, #722f37 0%, #8B3A3E 70%, #A0474D 100%)',
            borderRadius: '0 0 32px 32px',
            animation: 'fillWine 2.5s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '8px',
            width: '15px',
            height: '30px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
            borderRadius: '50%',
            filter: 'blur(2px)'
          }}></div>
        </div>
        <div style={{
          width: '6px',
          height: '35px',
          background: 'linear-gradient(to bottom, #8B4513 0%, #6B3410 100%)',
          borderRadius: '3px'
        }}></div>
        <div style={{
          width: '40px',
          height: '8px',
          background: 'linear-gradient(to bottom, #8B4513 0%, #6B3410 100%)',
          borderRadius: '50%'
        }}></div>
      </div>
      <style>{`
        @keyframes fillWine {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(0%);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default WineGlassLoader;