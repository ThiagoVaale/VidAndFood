import { useId, useState } from "react";

interface DisclousureProps {
  title: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
  isLast?: boolean;
  previewContent?: string;
} 

const WineFilterDisclosure: React.FC<DisclousureProps> = ({
  title,
  children,
  isCollapsed = false,
  isLast = false,
  previewContent,
}) => {
  const [isOpen, setIsOpen] = useState(!isCollapsed);
  const ids = useId()
  const buttonId = `discl-btn-${ids}`;
  const panelId = `discl-panel-${ids}`;

  return (
    <div style={{ 
      borderBottom: isLast ? 'none' : '2px solid #e5e7eb',
      marginBottom: isLast ? '0' : '8px',
      paddingBottom: isLast ? '0' : '8px',
      position: 'relative',
      background: 'transparent'
    }}>
      <button
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
          padding: '32px 24px 24px 24px',
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
          minHeight: '80px'
        }}
      >
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          flexGrow: 1,
          minWidth: 0,
          justifyContent: 'center',
          minHeight: '48px',
          background: 'transparent'
        }}>
          <h3 style={{ 
            fontWeight: '600',
            color: '#111827',
            fontSize: '18px',
            lineHeight: '1.3',
            margin: '0 0 6px 0',
            background: 'transparent'
          }}>
            {title}
          </h3>

          {!isOpen && !!previewContent && (
            <span style={{ 
              fontSize: '15px',
              color: '#6b7280',
              lineHeight: '1.4',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              marginTop: '4px',
              background: 'transparent'
            }}
              title={previewContent}
            >
              {previewContent}
            </span>
          )}
        </div>

        <svg
          style={{
            width: '24px',
            height: '24px',
            color: '#9ca3af',
            transition: 'all .2s',
            flexShrink: 0,
            marginLeft: '16px',
            marginTop: '4px',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div 
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{ 
          paddingBottom: '32px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '8px',
          borderTop: '1px solid #f3f4f6',
          marginTop: '8px',
          background: 'transparent'
        }}>
          <div style={{ marginTop: '12px', background: 'transparent' }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default WineFilterDisclosure;