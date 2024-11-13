const NotFound = () => {
  return (
    <div
      style={{
        backgroundImage: 'url("/pagenotfound.png")',
        backgroundSize: '30%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: '#dc3545', marginBottom: '1rem' }}>
          Không tìm thấy trang
        </h1>
        <p style={{ color: '#6c757d' }}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
  