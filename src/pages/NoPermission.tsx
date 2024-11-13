const NoPermission = () => {
  return (
    <div
      style={{
        backgroundImage: 'url("/no-permission.png")',
        backgroundSize: '30%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          marginTop: '50px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: '#dc3545', marginBottom: '1rem' }}>
          Không có quyền truy cập
        </h1>
        <p style={{ color: '#6c757d' }}>
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên.
        </p>
      </div>
    </div>
  );
};

export default NoPermission;
