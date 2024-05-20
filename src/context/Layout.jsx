import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <main className="main-container">
        {children}
      </main>
    </div>
  )
}

export default Layout