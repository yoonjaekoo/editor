import React, { useState, useCallback } from 'react';
import CodeEditor from './components/CodeEditor';

// Activity bar icons as simple SVGs
const FilesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 21.79l1.42 1.42 8.07-8.07A8.25 8.25 0 1 0 15.25 0zm0 14.5a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z"/>
  </svg>
);

const GitIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.007 8.222A3.738 3.738 0 0 0 15.045 5.2a3.737 3.737 0 0 0 1.156 6.583 2.988 2.988 0 0 1-2.668 1.67h-2.99a4.456 4.456 0 0 0-2.989 1.165V7.559a3.737 3.737 0 1 0-1.494 0v8.882a3.737 3.737 0 1 0 1.494.094 2.992 2.992 0 0 1 2.989-2.723h2.99a4.456 4.456 0 0 0 4.456-4.167 3.738 3.738 0 0 0 3.016-1.423zM5.063 3.738a2.244 2.244 0 1 1 4.488 0 2.244 2.244 0 0 1-4.488 0zm4.488 16.524a2.244 2.244 0 1 1-4.488 0 2.244 2.244 0 0 1 4.488 0zm8.462-9.958a2.244 2.244 0 1 1 0-4.488 2.244 2.244 0 0 1 0 4.488z"/>
  </svg>
);

const DebugIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.94 13.5l-1.32 1.32a3.73 3.73 0 0 0-7.24 0L1.06 13.5 0 14.56l1.72 1.72-.22.22V18H0v1.5h1.5v.08c.077.489.214.966.41 1.42L0 22.94 1.06 24l1.65-1.65A4.308 4.308 0 0 0 6 24a4.31 4.31 0 0 0 3.29-1.65L10.94 24 12 22.94 10.09 21c.198-.464.336-.951.41-1.45v-.07H12V18h-1.5v-1.5l-.22-.22L12 14.56l-1.06-1.06zM6 13.5a2.25 2.25 0 0 1 2.25 2.25h-4.5A2.25 2.25 0 0 1 6 13.5zm3 6a3.33 3.33 0 0 1-3 3 3.33 3.33 0 0 1-3-3v-2.25h6v2.25zm14.76-9.9v1.26L13.5 17.37V15.6l8.5-5.37L9 2v2.28L2.26 8.24l-.01-1.76 9.02-5.7a1.49 1.49 0 0 1 1.46 0l11.03 6.96v.36z"/>
  </svg>
);

const ExtensionsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 1.5L15 0h7.5L24 1.5V9l-1.5 1.5L15 0l-1.5 1.5zm0 0L15 3v6l-1.5 1.5L12 9V3l1.5-1.5zM1.5 13.5L0 15v7.5L1.5 24H9l1.5-1.5L0 15l1.5-1.5zm0 0L3 15v6l-1.5 1.5L0 21v-6l1.5-1.5zM21 13.5h-3.75L13.5 9v3.75L17.25 16.5l3.75-3zm-9 7.5l3.75-3.75L21 15v6l-1.5 1.5H15l-3-1.5z"/>
    <path d="M20.97 11.53a3.53 3.53 0 0 0-3.44-3.44 3.53 3.53 0 0 0-3.44 3.44 3.53 3.53 0 0 0 3.44 3.44 3.53 3.53 0 0 0 3.44-3.44zm-9.06 0a3.53 3.53 0 0 0-3.44-3.44 3.53 3.53 0 0 0-3.44 3.44 3.53 3.53 0 0 0 3.44 3.44 3.53 3.53 0 0 0 3.44-3.44zM6.56 1.5h3.44v3.44H6.56V1.5z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/>
  </svg>
);

// File tree data
interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  open?: boolean;
  children?: TreeNode[];
  icon?: string;
}

const FILE_TREE: TreeNode[] = [
  { name: 'CPP-PROJECT', type: 'folder', open: true, children: [
    { name: 'src', type: 'folder', open: true, children: [
      { name: 'main.cpp', type: 'file', icon: 'cpp' },
      { name: 'graph.h', type: 'file', icon: 'h' },
      { name: 'utils.h', type: 'file', icon: 'h' },
      { name: 'solver.cpp', type: 'file', icon: 'cpp' },
    ]},
    { name: 'include', type: 'folder', open: false, children: [
      { name: 'constants.h', type: 'file', icon: 'h' },
      { name: 'types.h', type: 'file', icon: 'h' },
    ]},
    { name: 'tests', type: 'folder', open: false, children: [
      { name: 'test_graph.cpp', type: 'file', icon: 'cpp' },
      { name: 'test_utils.cpp', type: 'file', icon: 'cpp' },
    ]},
    { name: '.gitignore', type: 'file' },
    { name: 'CMakeLists.txt', type: 'file' },
    { name: 'README.md', type: 'file' },
  ]},
];

interface Tab {
  name: string;
  path: string;
  modified?: boolean;
}

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string>('explorer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabs, setTabs] = useState<Tab[]>([
    { name: 'main.cpp', path: 'src/main.cpp', modified: false },
    { name: 'graph.h', path: 'src/graph.h' },
    { name: 'utils.h', path: 'src/utils.h' },
  ]);
  const [activeTab, setActiveTab] = useState('main.cpp');
  const [cursorInfo, setCursorInfo] = useState({ line: 1, col: 1, total: 1 });
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['CPP-PROJECT', 'src']));

  const toggleFolder = (name: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleTabClick = useCallback((name: string) => {
    setActiveTab(name);
  }, []);

  const handleTabClose = useCallback((e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setTabs(prev => prev.filter(t => t.name !== name));
    if (activeTab === name && tabs.length > 1) {
      const idx = tabs.findIndex(t => t.name === name);
      const newIdx = Math.min(idx, tabs.length - 2);
      setActiveTab(tabs[newIdx].name);
    }
  }, [activeTab, tabs]);

  const handleCursorChange = useCallback((line: number, col: number, total: number) => {
    setCursorInfo({ line: line + 1, col: col + 1, total });
  }, []);

  const getFileIcon = (name: string) => {
    if (name.endsWith('.cpp')) return <span style={{ color: '#519aba', fontSize: 12 }}>C+</span>;
    if (name.endsWith('.h')) return <span style={{ color: '#a074c4', fontSize: 12 }}>H</span>;
    if (name.endsWith('.txt')) return <span style={{ color: '#858585', fontSize: 12 }}>T</span>;
    if (name.endsWith('.md')) return <span style={{ color: '#519aba', fontSize: 12 }}>M</span>;
    if (name.startsWith('.')) return <span style={{ color: '#858585', fontSize: 12}}>·</span>;
    return <span style={{ color: '#858585', fontSize: 12 }}>◇</span>;
  };

  const renderTree = (nodes: TreeNode[], depth: number = 0): React.ReactNode => {
    return nodes.map(node => {
      const isFolder = node.type === 'folder';
      const isExpanded = expandedFolders.has(node.name);
      return (
        <React.Fragment key={node.name + depth}>
          <div
            className="sidebar-item"
            style={{
              paddingLeft: 12 + depth * 16,
              paddingRight: 8,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
              fontSize: 13,
              color: node.type === 'file' && node.name === activeTab ? '#ccc' : '#aaa',
              background: node.type === 'file' && node.name === activeTab ? 'rgba(255,255,255,0.05)' : 'transparent',
            }}
            onClick={() => isFolder ? toggleFolder(node.name) : setActiveTab(node.name)}
          >
            {isFolder ? (
              <span style={{ fontSize: 10, width: 12, textAlign: 'center', color: '#858585' }}>
                {isExpanded ? '▾' : '▸'}
              </span>
            ) : (
              <span style={{ width: 12 }} />
            )}
            {isFolder ? (
              <span style={{ color: '#e8ab53', fontSize: 14 }}>
                {isExpanded ? '📂' : '📁'}
              </span>
            ) : getFileIcon(node.name)}
            <span>{node.name}</span>
          </div>
          {isFolder && isExpanded && node.children && renderTree(node.children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#1e1e1e' }}>
      {/* Title Bar */}
      <div style={{
        height: 30, minHeight: 30,
        background: '#323233',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none', position: 'relative',
        borderTop: '1px solid #1e1e1e',
      }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
        </div>
        <div style={{ fontSize: 13, color: '#999' }}>
          {activeTab} — cpp-project — Visual Studio Code
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Activity Bar */}
        <div style={{
          width: 48, minWidth: 48,
          background: '#333333',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRight: '1px solid #252526',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {[
              { id: 'explorer', Icon: FilesIcon },
              { id: 'search', Icon: SearchIcon },
              { id: 'git', Icon: GitIcon },
              { id: 'debug', Icon: DebugIcon },
              { id: 'extensions', Icon: ExtensionsIcon },
            ].map(({ id, Icon }) => (
              <div
                key={id}
                className={`activity-icon ${activePanel === id && sidebarOpen ? 'active' : ''}`}
                style={{
                  width: 48, height: 48,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: activePanel === id && sidebarOpen ? '#fff' : '#858585',
                  borderLeft: activePanel === id && sidebarOpen ? '2px solid #fff' : '2px solid transparent',
                  opacity: activePanel === id && sidebarOpen ? 1 : 0.6,
                }}
                onClick={() => {
                  if (activePanel === id && sidebarOpen) { setSidebarOpen(false); }
                  else { setActivePanel(id); setSidebarOpen(true); }
                }}
              >
                <Icon />
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 0' }}>
            <div
              className="activity-icon"
              style={{
                width: 48, height: 48,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#858585', opacity: 0.6,
              }}
            >
              <SettingsIcon />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{
            width: 220, minWidth: 220,
            background: '#252526',
            borderRight: '1px solid #1e1e1e',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease',
          }}>
            <div style={{
              height: 35, display: 'flex', alignItems: 'center',
              paddingLeft: 20, paddingRight: 12,
              fontSize: 11, fontWeight: 600,
              color: '#bbb', letterSpacing: 0.5,
              textTransform: 'uppercase',
              justifyContent: 'space-between',
            }}>
              <span>Explorer</span>
              <span style={{ cursor: 'pointer', fontSize: 14, opacity: 0.5 }}>···</span>
            </div>
            <div style={{ flex: 1, overflow: 'auto', fontSize: 13 }} className="vscode-scroll">
              {renderTree(FILE_TREE)}
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tab Bar */}
          <div style={{
            height: 35, minHeight: 35,
            background: '#252526',
            display: 'flex',
            borderBottom: '1px solid #252526',
            overflow: 'hidden',
          }}>
            {tabs.map(tab => (
              <div
                key={tab.name}
                className="tab-item"
                onClick={() => handleTabClick(tab.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 16px',
                  height: 35,
                  cursor: 'pointer',
                  fontSize: 13,
                  background: tab.name === activeTab ? '#1e1e1e' : '#2d2d2d',
                  color: tab.name === activeTab ? '#fff' : '#999',
                  borderTop: tab.name === activeTab ? '1px solid #007acc' : '1px solid transparent',
                  borderRight: '1px solid #252526',
                  minWidth: 0,
                  position: 'relative',
                  userSelect: 'none',
                }}
              >
                <span style={{ fontSize: 11, color: '#519aba' }}>C++</span>
                <span style={{ whiteSpace: 'nowrap' }}>{tab.name}</span>
                <span
                  onClick={(e) => handleTabClose(e, tab.name)}
                  style={{
                    marginLeft: 8, fontSize: 14, color: '#666',
                    width: 20, height: 20, borderRadius: 3,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  ×
                </span>
              </div>
            ))}
          </div>

          {/* Breadcrumb */}
          <div style={{
            height: 22, minHeight: 22,
            background: '#1e1e1e',
            display: 'flex', alignItems: 'center',
            paddingLeft: 12, fontSize: 12,
            color: '#858585', gap: 4,
            borderBottom: '1px solid #2d2d2d',
          }}>
            <span>src</span>
            <span style={{ fontSize: 10 }}>›</span>
            <span style={{ color: '#ccc' }}>{activeTab}</span>
          </div>

          {/* Editor */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {activeTab === 'main.cpp' ? (
              <CodeEditor onCursorChange={handleCursorChange} />
            ) : (
              <div style={{
                height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#555', fontSize: 14, background: '#1e1e1e',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📄</div>
                  <div>{activeTab}</div>
                  <div style={{ fontSize: 12, marginTop: 4, color: '#444' }}>File preview not available</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        height: 22, minHeight: 22,
        background: '#007acc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 12, paddingRight: 12,
        fontSize: 12,
        color: '#fff',
        userSelect: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div className="status-item" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px', height: 22 }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14.5 5.5l-3-3-1 1 3 3 1-1zm-7 7l-3-3-1 1 3 3 1-1zm-3-3l7-7-1-1-7 7 1 1z"/>
            </svg>
            main
          </div>
          <div className="status-item" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px', height: 22 }}>
            <span>0⚠</span>
            <span>0∅</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div className="status-item" style={{ padding: '0 8px', height: 22, display: 'flex', alignItems: 'center' }}>
            Ln {cursorInfo.line}, Col {cursorInfo.col}
          </div>
          <div className="status-item" style={{ padding: '0 8px', height: 22, display: 'flex', alignItems: 'center' }}>
            Spaces: 4
          </div>
          <div className="status-item" style={{ padding: '0 8px', height: 22, display: 'flex', alignItems: 'center' }}>
            UTF-8
          </div>
          <div className="status-item" style={{ padding: '0 8px', height: 22, display: 'flex', alignItems: 'center' }}>
            CRLF
          </div>
          <div className="status-item" style={{ padding: '0 8px', height: 22, display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ fontSize: 10 }}>C++</span>
          </div>
          <div className="status-item" style={{ padding: '0 6px', height: 22, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.9 3.1c1.3 1.2 1.3 3.4 0 4.6L8 12.6 3.1 7.7c-1.3-1.2-1.3-3.4 0-4.6 1.2-1.2 3.3-1.2 4.5 0l.4.4.4-.4c1.2-1.2 3.3-1.2 4.5 0z"/>
            </svg>
            Prettier
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
