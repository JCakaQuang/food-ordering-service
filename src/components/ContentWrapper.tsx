import React from 'react';

// Component này nhận 'children', tức là bất kỳ nội dung nào bạn đặt bên trong nó
const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main style={{ padding: '24px 50px', minHeight: '80vh' }}>
      {children}
    </main>
  );
};

export default ContentWrapper;