import React from 'react';
export default function PlaceholderAdminPage({ title }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>{title}</h2>
      <p>This is a placeholder page for {title}.</p>
    </div>
  );
}
