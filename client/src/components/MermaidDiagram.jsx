import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  logLevel: 'error'
});

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Determine theme based on system or class
    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({ 
      theme: isDark ? 'dark' : 'default',
      startOnLoad: false 
    });

    if (chart && ref.current) {
      setError(false);
      const renderDiagram = async () => {
        try {
          // Generate a unique ID for the diagram
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          
          // Verify if it's valid mermaid before rendering to avoid internal error UI
          try {
            await mermaid.parse(chart);
          } catch (parseError) {
            console.error("Mermaid Parse Error:", parseError);
            setError(true);
            return;
          }

          const { svg } = await mermaid.render(id, chart);
          setSvg(svg);
        } catch (err) {
          console.error("Mermaid rendering error:", err);
          setError(true);
        }
      };
      renderDiagram();
    }
  }, [chart]);

  if (!chart) return null;

  if (error) {
    return (
      <div className="p-6 glass-card border-red-500/20 bg-red-500/5 rounded-2xl text-red-400 text-sm flex items-center gap-3">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        AI generated an invalid diagram structure. Try re-analyzing.
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className="mermaid-container flex justify-center p-6 bg-black/20 rounded-2xl overflow-x-auto border border-white/5"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidDiagram;
