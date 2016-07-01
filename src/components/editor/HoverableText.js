import React from 'react';
import hover from './hoverContainer';

const fontFamily = 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif';

const HoverableText = hover()(({ text, color, style, onClick }) => (
  <span onClick={onClick} style={{ ...style, fontFamily, color, fontSize: 20, fontWeight: style.fontWeight || 500 }}>
    {text}
  </span>
));

export default HoverableText;
