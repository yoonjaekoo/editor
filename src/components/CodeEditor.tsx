import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// ===================== Types =====================
interface CursorPos { line: number; col: number; }
interface SelectionRange { start: CursorPos; end: CursorPos; }
interface ColumnSelection { anchor: CursorPos; active: CursorPos; }
interface Particle { id: number; x: number; y: number; dx: number; dy: number; color: string; }
type TokenType = 'keyword' | 'control' | 'type' | 'string' | 'number' | 'comment' | 'preprocessor' | 'function' | 'operator' | 'bracket' | 'punctuation' | 'constant' | 'plain';
interface Token { type: TokenType; text: string; }

// ===================== Constants =====================
const LINE_HEIGHT = 20;
const GUTTER_WIDTH = 60;
const TAB_SIZE = 4;
const SCROLL_MARGIN = 40;

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: '#569cd6', control: '#c586c0', type: '#4ec9b0',
  string: '#ce9178', number: '#b5cea8', comment: '#6a9955',
  preprocessor: '#c586c0', function: '#dcdcaa', operator: '#d4d4d4',
  bracket: '#ffd700', punctuation: '#858585', constant: '#569cd6', plain: '#d4d4d4',
};

const KEYWORDS = new Set(['int','void','return','class','struct','public','private','protected','virtual','override','const','static','namespace','using','template','typename','new','delete','this','auto','sizeof','typedef','enum','union','friend','inline','explicit','mutable','volatile','extern','constexpr','decltype','noexcept','throw','try','catch','operator','register']);
const CONTROL = new Set(['if','else','for','while','do','switch','case','break','continue','default','goto']);
const TYPES = new Set(['std','string','vector','map','set','unordered_map','unordered_set','pair','tuple','array','deque','list','queue','stack','priority_queue','unique_ptr','shared_ptr','weak_ptr','optional','variant','any','iostream','ostream','istream','fstream','stringstream','cin','cout','cerr','endl','size_t','uint8_t','int32_t','int64_t','bool','char','double','float','long','short','unsigned','signed','Graph','Solution','Node','Edge']);
const CONSTANTS = new Set(['true','false','nullptr','NULL','EOF','stdin','stdout','stderr']);

// ===================== Default Code =====================
const DEFAULT_CODE = `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <queue>

using namespace std;

/**
 * Graph implementation with BFS and DFS
 * traversal algorithms for pathfinding
 */
class Graph {
private:
    int vertices;
    vector<vector<int>> adjList;

public:
    // Constructor
    Graph(int v) : vertices(v), adjList(v) {}

    void addEdge(int u, int v) {
        adjList[u].push_back(v);
        adjList[v].push_back(u);
    }

    // Breadth-First Search
    vector<int> bfs(int start) {
        vector<bool> visited(vertices, false);
        vector<int> result;
        queue<int> q;

        visited[start] = true;
        q.push(start);

        while (!q.empty()) {
            int node = q.front();
            q.pop();
            result.push_back(node);

            for (int neighbor : adjList[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
        return result;
    }

    // DFS Helper function
    void dfsHelper(int node, vector<bool>& visited,
                   vector<int>& result) {
        visited[node] = true;
        result.push_back(node);

        for (int next : adjList[node]) {
            if (!visited[next]) {
                dfsHelper(next, visited, result);
            }
        }
    }

    // Depth-First Search
    vector<int> dfs(int start) {
        vector<bool> visited(vertices, false);
        vector<int> result;
        dfsHelper(start, visited, result);
        return result;
    }

    // Get shortest path using BFS
    vector<int> shortestPath(int src, int dest) {
        vector<int> parent(vertices, -1);
        vector<bool> visited(vertices, false);
        queue<int> q;

        visited[src] = true;
        q.push(src);

        while (!q.empty()) {
            int curr = q.front();
            q.pop();

            if (curr == dest) break;

            for (int nbr : adjList[curr]) {
                if (!visited[nbr]) {
                    visited[nbr] = true;
                    parent[nbr] = curr;
                    q.push(nbr);
                }
            }
        }

        // Reconstruct path
        vector<int> path;
        int node = dest;
        while (node != -1) {
            path.push_back(node);
            node = parent[node];
        }
        reverse(path.begin(), path.end());
        return path;
    }
};

// Template function to find maximum
template<typename T>
T findMax(const vector<T>& arr) {
    T maxVal = arr[0];
    for (const auto& item : arr) {
        if (item > maxVal) {
            maxVal = item;
        }
    }
    return maxVal;
}

// Fibonacci with O(n) time complexity
int fibonacci(int n) {
    if (n <= 1) return n;

    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}

// Calculate factorial recursively
long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    // Create a graph with 7 vertices
    Graph g(7);
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 3);
    g.addEdge(1, 4);
    g.addEdge(2, 5);
    g.addEdge(2, 6);
    g.addEdge(3, 5);

    // Test BFS traversal
    cout << "BFS from node 0: ";
    for (int v : g.bfs(0)) {
        cout << v << " ";
    }
    cout << endl;

    // Test DFS traversal
    cout << "DFS from node 0: ";
    for (int v : g.dfs(0)) {
        cout << v << " ";
    }
    cout << endl;

    // Find shortest path
    cout << "Shortest path 0->5: ";
    for (int v : g.shortestPath(0, 5)) {
        cout << v << " ";
    }
    cout << endl;

    // Test fibonacci
    cout << "\\nFibonacci sequence: ";
    for (int i = 0; i < 12; i++) {
        cout << fibonacci(i) << " ";
    }
    cout << endl;

    // Test max finder with template
    vector<int> numbers = {3, 7, 2, 9, 1, 5, 8, 4, 6, 0};
    cout << "Maximum value: " << findMax(numbers) << endl;

    // Test factorial
    for (int i = 1; i <= 10; i++) {
        cout << i << "! = " << factorial(i) << endl;
    }

    string message = "Hello, C++ World!";
    cout << "\\n" << message << endl;

    return 0;
}`;

// ===================== Tokenizer =====================
function tokenizeLine(line: string, inBlock: boolean): { tokens: Token[]; inBlockComment: boolean } {
  const tokens: Token[] = [];
  let i = 0;
  let isBlock = inBlock;

  while (i < line.length) {
    if (isBlock) {
      const end = line.indexOf('*/', i);
      if (end !== -1) {
        tokens.push({ type: 'comment', text: line.slice(i, end + 2) });
        i = end + 2; isBlock = false;
      } else {
        tokens.push({ type: 'comment', text: line.slice(i) });
        return { tokens, inBlockComment: true };
      }
      continue;
    }

    // Line comment
    if (line[i] === '/' && i + 1 < line.length && line[i + 1] === '/') {
      tokens.push({ type: 'comment', text: line.slice(i) });
      return { tokens, inBlockComment: false };
    }

    // Block comment start
    if (line[i] === '/' && i + 1 < line.length && line[i + 1] === '*') {
      const end = line.indexOf('*/', i + 2);
      if (end !== -1) {
        tokens.push({ type: 'comment', text: line.slice(i, end + 2) });
        i = end + 2;
      } else {
        tokens.push({ type: 'comment', text: line.slice(i) });
        return { tokens, inBlockComment: true };
      }
      continue;
    }

    // String
    if (line[i] === '"') {
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === '\\') { j += 2; continue; }
        if (line[j] === '"') break;
        j++;
      }
      tokens.push({ type: 'string', text: line.slice(i, j + 1) });
      i = j + 1; continue;
    }

    // Char literal
    if (line[i] === "'") {
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === '\\') { j += 2; continue; }
        if (line[j] === "'") break;
        j++;
      }
      tokens.push({ type: 'string', text: line.slice(i, j + 1) });
      i = j + 1; continue;
    }

    // Preprocessor
    if (line[i] === '#') {
      const rest = line.slice(i);
      const m = rest.match(/^#\w+/);
      if (m) {
        tokens.push({ type: 'preprocessor', text: m[0] });
        i += m[0].length;
        // Rest of line after include
        const rest2 = line.slice(i).trimStart();
        if (rest2) {
          tokens.push({ type: 'plain', text: line.slice(i, i + (line.length - i - rest2.length)) });
          if (rest2.startsWith('<')) {
            const closeIdx = rest2.indexOf('>');
            if (closeIdx !== -1) {
              tokens.push({ type: 'string', text: rest2.slice(0, closeIdx + 1) });
              i = line.length; continue;
            }
          }
        }
        continue;
      }
    }

    // Number
    if (/[0-9]/.test(line[i]) || (line[i] === '.' && i + 1 < line.length && /[0-9]/.test(line[i + 1]))) {
      const m = line.slice(i).match(/^0[xX][0-9a-fA-F]+[uUlL]*|^[0-9]+\.?[0-9]*([eE][+-]?[0-9]+)?[fFlLuU]*/);
      if (m && m[0]) {
        tokens.push({ type: 'number', text: m[0] });
        i += m[0].length; continue;
      }
    }

    // Identifier / keyword
    if (/[a-zA-Z_]/.test(line[i])) {
      const m = line.slice(i).match(/^[a-zA-Z_]\w*/);
      if (m) {
        const w = m[0];
        let tt: TokenType = 'plain';
        if (KEYWORDS.has(w)) tt = 'keyword';
        else if (CONTROL.has(w)) tt = 'control';
        else if (TYPES.has(w)) tt = 'type';
        else if (CONSTANTS.has(w)) tt = 'constant';
        else {
          const afterIdx = i + w.length;
          if (afterIdx < line.length && line[afterIdx] === '(') tt = 'function';
        }
        tokens.push({ type: tt, text: w });
        i += w.length; continue;
      }
    }

    // Operators
    if ('+-*/%=<>!&|^~?:'.includes(line[i])) {
      tokens.push({ type: 'operator', text: line[i] }); i++; continue;
    }

    // Brackets
    if ('(){}[]'.includes(line[i])) {
      tokens.push({ type: 'bracket', text: line[i] }); i++; continue;
    }

    // Semicolon / comma
    if (line[i] === ';' || line[i] === ',') {
      tokens.push({ type: 'punctuation', text: line[i] }); i++; continue;
    }

    // Whitespace
    if (line[i] === ' ' || line[i] === '\t') {
      let j = i;
      while (j < line.length && (line[j] === ' ' || line[j] === '\t')) j++;
      tokens.push({ type: 'plain', text: line.slice(i, j) });
      i = j; continue;
    }

    // Fallback
    tokens.push({ type: 'plain', text: line[i] }); i++;
  }

  return { tokens, inBlockComment: isBlock };
}

// ===================== Helpers =====================
function compareCursors(a: CursorPos, b: CursorPos): number {
  if (a.line !== b.line) return a.line - b.line;
  return a.col - b.col;
}

function getIndent(line: string): string {
  const m = line.match(/^(\s*)/);
  return m ? m[1] : '';
}

// ===================== Component =====================
const CodeEditor: React.FC<{
  onCursorChange?: (line: number, col: number, totalLines: number) => void;
}> = ({ onCursorChange }) => {
  // State
  const [lines, setLines] = useState<string[]>(() => DEFAULT_CODE.split('\n'));
  const [cursor, setCursor] = useState<CursorPos>({ line: 0, col: 0 });
  const [selection, setSelection] = useState<SelectionRange | null>(null);
  const [columnSel, setColumnSel] = useState<ColumnSelection | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [typing, setTyping] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [autoScroll, setAutoScroll] = useState<{ oy: number; cy: number; ox: number; cx: number } | null>(null);
  const [charWidth, setCharWidth] = useState(8.4);

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const desiredColRef = useRef(0);
  const lastActivityRef = useRef(Date.now());
  const isDraggingRef = useRef(false);
  const isAltDragRef = useRef(false);
  const dragStartRef = useRef<CursorPos | null>(null);
  const typingTimerRef = useRef<number>(0);
  const autoScrollRafRef = useRef(0);
  const cursorRef = useRef(cursor);
  const linesRef = useRef(lines);
  const selRef = useRef(selection);
  const colSelRef = useRef(columnSel);

  // Keep refs in sync
  useEffect(() => { cursorRef.current = cursor; onCursorChange?.(cursor.line, cursor.col, lines.length); }, [cursor, lines.length]);
  useEffect(() => { linesRef.current = lines; }, [lines]);
  useEffect(() => { selRef.current = selection; }, [selection]);
  useEffect(() => { colSelRef.current = columnSel; }, [columnSel]);

  // Measure char width
  useEffect(() => {
    const measure = () => {
      const span = document.createElement('span');
      span.style.font = '14px "Fira Code", Consolas, "Courier New", monospace';
      span.style.position = 'absolute';
      span.style.visibility = 'hidden';
      span.style.whiteSpace = 'pre';
      span.textContent = 'M'.repeat(20);
      document.body.appendChild(span);
      const w = span.getBoundingClientRect().width / 20;
      document.body.removeChild(span);
      if (w > 0) setCharWidth(w);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, []);

  // Cursor blink
  useEffect(() => {
    const iv = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed > 500) setCursorVisible(v => !v);
      else setCursorVisible(true);
    }, 530);
    return () => clearInterval(iv);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll) {
      const tick = () => {
        if (!scrollRef.current) return;
        const speedY = (autoScroll.cy - autoScroll.oy) * 0.08;
        const speedX = (autoScroll.cx - autoScroll.ox) * 0.05;
        scrollRef.current.scrollTop += speedY;
        scrollRef.current.scrollLeft += speedX;
        autoScrollRafRef.current = requestAnimationFrame(tick);
      };
      autoScrollRafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(autoScrollRafRef.current);
    }
  }, [autoScroll]);

  // Ensure cursor visible
  useEffect(() => {
    if (!scrollRef.current) return;
    const ct = scrollRef.current;
    const curTop = cursor.line * LINE_HEIGHT;
    const curBot = curTop + LINE_HEIGHT;
    const curLeft = cursor.col * charWidth;
    if (curTop - SCROLL_MARGIN < ct.scrollTop) ct.scrollTop = curTop - SCROLL_MARGIN;
    else if (curBot + SCROLL_MARGIN > ct.scrollTop + ct.clientHeight) ct.scrollTop = curBot + SCROLL_MARGIN - ct.clientHeight;
    if (curLeft - SCROLL_MARGIN < ct.scrollLeft) ct.scrollLeft = curLeft - SCROLL_MARGIN;
    else if (curLeft + SCROLL_MARGIN > ct.scrollLeft + ct.clientWidth) ct.scrollLeft = curLeft + SCROLL_MARGIN - ct.clientWidth;
  }, [cursor.line, cursor.col, charWidth]);

  // ---- Utility callbacks ----
  const signalActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setCursorVisible(true);
  }, []);

  const triggerTypingEffect = useCallback(() => {
    setTyping(true);
    window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => setTyping(false), 280);
  }, []);

  const spawnParticles = useCallback((x: number, y: number) => {
    const colors = ['#569cd6', '#ce9178', '#b5cea8', '#dcdcaa', '#c586c0', '#4ec9b0'];
    const np: Particle[] = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() * 1000 + i + Math.random(),
      x, y,
      dx: (Math.random() - 0.5) * 60,
      dy: (Math.random() - 0.5) * 60 - 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(prev => [...prev, ...np]);
    setTimeout(() => setParticles(prev => prev.filter(p => !np.includes(p))), 700);
  }, []);

  const getCursorFromMouse = useCallback((e: React.MouseEvent): CursorPos => {
    if (!scrollRef.current) return { line: 0, col: 0 };
    const rect = scrollRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + scrollRef.current.scrollLeft - 4;
    const y = e.clientY - rect.top + scrollRef.current.scrollTop;
    const line = Math.max(0, Math.min(Math.floor(y / LINE_HEIGHT), linesRef.current.length - 1));
    const col = Math.max(0, Math.min(Math.round(x / charWidth), linesRef.current[line].length));
    return { line, col };
  }, [charWidth]);

  // ---- Selection helpers ----
  const deleteSelection = useCallback((curLines: string[], cur: CursorPos, sel: SelectionRange | null, cSel: ColumnSelection | null): { lines: string[]; cursor: CursorPos } => {
    if (cSel) {
      const minL = Math.min(cSel.anchor.line, cSel.active.line);
      const maxL = Math.max(cSel.anchor.line, cSel.active.line);
      const minC = Math.min(cSel.anchor.col, cSel.active.col);
      const maxC = Math.max(cSel.anchor.col, cSel.active.col);
      const nl = [...curLines];
      for (let i = minL; i <= maxL; i++) {
        nl[i] = nl[i].slice(0, minC) + nl[i].slice(Math.min(maxC, nl[i].length));
      }
      return { lines: nl, cursor: { line: minL, col: minC } };
    }
    if (sel) {
      const s = compareCursors(sel.start, sel.end) <= 0 ? sel.start : sel.end;
      const e = compareCursors(sel.start, sel.end) <= 0 ? sel.end : sel.start;
      const nl = [...curLines];
      if (s.line === e.line) {
        nl[s.line] = nl[s.line].slice(0, s.col) + nl[s.line].slice(e.col);
        return { lines: nl, cursor: s };
      }
      nl[s.line] = nl[s.line].slice(0, s.col) + nl[e.line].slice(e.col);
      nl.splice(s.line + 1, e.line - s.line);
      return { lines: nl, cursor: s };
    }
    return { lines: curLines, cursor: cur };
  }, []);

  const getSelectedText = useCallback((): string => {
    const ls = linesRef.current;
    const cSel = colSelRef.current;
    const sel = selRef.current;
    if (cSel) {
      const minL = Math.min(cSel.anchor.line, cSel.active.line);
      const maxL = Math.max(cSel.anchor.line, cSel.active.line);
      const minC = Math.min(cSel.anchor.col, cSel.active.col);
      const maxC = Math.max(cSel.anchor.col, cSel.active.col);
      return ls.slice(minL, maxL + 1).map(l => l.slice(minC, maxC)).join('\n');
    }
    if (sel) {
      const s = compareCursors(sel.start, sel.end) <= 0 ? sel.start : sel.end;
      const e = compareCursors(sel.start, sel.end) <= 0 ? sel.end : sel.start;
      if (s.line === e.line) return ls[s.line].slice(s.col, e.col);
      let t = ls[s.line].slice(s.col);
      for (let i = s.line + 1; i < e.line; i++) t += '\n' + ls[i];
      t += '\n' + ls[e.line].slice(0, e.col);
      return t;
    }
    return '';
  }, []);

  // ---- Text operations ----
  const insertText = useCallback((text: string) => {
    const curLines = [...linesRef.current];
    const cur = { ...cursorRef.current };
    const { lines: nl, cursor: nc } = deleteSelection(curLines, cur, selRef.current, colSelRef.current);
    const textLines = text.split('\n');
    const updated = [...nl];

    if (textLines.length === 1) {
      updated[nc.line] = updated[nc.line].slice(0, nc.col) + text + updated[nc.line].slice(nc.col);
      const newCol = nc.col + text.length;
      setCursor({ line: nc.line, col: newCol });
      desiredColRef.current = newCol;
    } else {
      const before = updated[nc.line].slice(0, nc.col);
      const after = updated[nc.line].slice(nc.col);
      updated[nc.line] = before + textLines[0];
      for (let i = 1; i < textLines.length; i++) updated.splice(nc.line + i, 0, textLines[i]);
      updated[nc.line + textLines.length - 1] += after;
      const fl = nc.line + textLines.length - 1;
      const fc = textLines[textLines.length - 1].length;
      setCursor({ line: fl, col: fc });
      desiredColRef.current = fc;
    }

    setLines(updated);
    setSelection(null);
    setColumnSel(null);
    signalActivity();
    triggerTypingEffect();
    const px = (nc.col + (textLines.length === 1 ? text.length : 0)) * charWidth;
    const py = nc.line * LINE_HEIGHT + LINE_HEIGHT / 2;
    spawnParticles(px, py);
  }, [charWidth, deleteSelection, signalActivity, triggerTypingEffect, spawnParticles]);

  const handleEnter = useCallback(() => {
    const curLines = [...linesRef.current];
    const cur = { ...cursorRef.current };
    const { lines: nl, cursor: nc } = deleteSelection(curLines, cur, selRef.current, colSelRef.current);
    const updated = [...nl];
    const indent = getIndent(updated[nc.line]);
    const beforeCursor = updated[nc.line].slice(0, nc.col);
    const afterCursor = updated[nc.line].slice(nc.col);

    let extraIndent = '';
    const trimmed = beforeCursor.trim();
    if (trimmed.endsWith('{')) extraIndent = '    ';

    updated[nc.line] = beforeCursor;
    updated.splice(nc.line + 1, 0, indent + extraIndent + afterCursor);

    const newCol = indent.length + extraIndent.length;
    setCursor({ line: nc.line + 1, col: newCol });
    desiredColRef.current = newCol;
    setLines(updated);
    setSelection(null);
    setColumnSel(null);
    signalActivity();
    triggerTypingEffect();
    spawnParticles(newCol * charWidth, (nc.line + 1) * LINE_HEIGHT + LINE_HEIGHT / 2);
  }, [charWidth, deleteSelection, signalActivity, triggerTypingEffect, spawnParticles]);

  const handleBackspace = useCallback(() => {
    const curLines = [...linesRef.current];
    const cur = { ...cursorRef.current };
    if (selRef.current || colSelRef.current) {
      const { lines: nl, cursor: nc } = deleteSelection(curLines, cur, selRef.current, colSelRef.current);
      setLines(nl); setCursor(nc); desiredColRef.current = nc.col;
      setSelection(null); setColumnSel(null);
      signalActivity(); triggerTypingEffect();
      return;
    }
    if (cur.col === 0 && cur.line === 0) return;
    const updated = [...curLines];
    let newLine = cur.line, newCol = cur.col;
    if (cur.col === 0) {
      newCol = updated[cur.line - 1].length;
      updated[cur.line - 1] += updated[cur.line];
      updated.splice(cur.line, 1);
      newLine = cur.line - 1;
    } else {
      const line = updated[cur.line];
      const delCount = cur.col >= TAB_SIZE && line.slice(cur.col - TAB_SIZE, cur.col) === ' '.repeat(TAB_SIZE) ? TAB_SIZE : 1;
      updated[cur.line] = line.slice(0, cur.col - delCount) + line.slice(cur.col);
      newCol = cur.col - delCount;
    }
    setLines(updated); setCursor({ line: newLine, col: newCol });
    desiredColRef.current = newCol;
    signalActivity(); triggerTypingEffect();
    spawnParticles(newCol * charWidth, newLine * LINE_HEIGHT + LINE_HEIGHT / 2);
  }, [charWidth, deleteSelection, signalActivity, triggerTypingEffect, spawnParticles]);

  const handleDelete = useCallback(() => {
    const curLines = [...linesRef.current];
    const cur = { ...cursorRef.current };
    if (selRef.current || colSelRef.current) {
      const { lines: nl, cursor: nc } = deleteSelection(curLines, cur, selRef.current, colSelRef.current);
      setLines(nl); setCursor(nc); desiredColRef.current = nc.col;
      setSelection(null); setColumnSel(null);
      signalActivity(); triggerTypingEffect();
      return;
    }
    const updated = [...curLines];
    if (cur.col === updated[cur.line].length) {
      if (cur.line === updated.length - 1) return;
      updated[cur.line] += updated[cur.line + 1];
      updated.splice(cur.line + 1, 1);
    } else {
      updated[cur.line] = updated[cur.line].slice(0, cur.col) + updated[cur.line].slice(cur.col + 1);
    }
    setLines(updated); signalActivity(); triggerTypingEffect();
    spawnParticles(cur.col * charWidth, cur.line * LINE_HEIGHT + LINE_HEIGHT / 2);
  }, [charWidth, deleteSelection, signalActivity, triggerTypingEffect, spawnParticles]);

  const handleTab = useCallback((shift: boolean) => {
    const curLines = [...linesRef.current];
    const cur = { ...cursorRef.current };
    const sel = selRef.current;

    if (sel) {
      const s = compareCursors(sel.start, sel.end) <= 0 ? sel.start : sel.end;
      const e = compareCursors(sel.start, sel.end) <= 0 ? sel.end : sel.start;
      const updated = [...curLines];
      if (shift) {
        for (let i = s.line; i <= e.line; i++) {
          if (updated[i].startsWith('    ')) updated[i] = updated[i].slice(4);
          else if (updated[i].startsWith('\t')) updated[i] = updated[i].slice(1);
          else updated[i] = updated[i].replace(/^ +/, '');
        }
      } else {
        for (let i = s.line; i <= e.line; i++) updated[i] = '    ' + updated[i];
      }
      setLines(updated); setSelection(null); signalActivity(); return;
    }

    const updated = [...curLines];
    if (shift) {
      if (updated[cur.line].slice(cur.col - TAB_SIZE, cur.col) === '    ') {
        updated[cur.line] = updated[cur.line].slice(0, cur.col - TAB_SIZE) + updated[cur.line].slice(cur.col);
        setCursor({ line: cur.line, col: cur.col - TAB_SIZE });
        desiredColRef.current = cur.col - TAB_SIZE;
      }
    } else {
      updated[cur.line] = updated[cur.line].slice(0, cur.col) + '    ' + updated[cur.line].slice(cur.col);
      setCursor({ line: cur.line, col: cur.col + TAB_SIZE });
      desiredColRef.current = cur.col + TAB_SIZE;
    }
    setLines(updated); setSelection(null); signalActivity(); triggerTypingEffect();
  }, [signalActivity, triggerTypingEffect]);

  // ---- Movement ----
  const moveLeft = useCallback((shift: boolean, ctrl: boolean) => {
    const cur = { ...cursorRef.current };
    const ls = linesRef.current;
    signalActivity();
    if (shift && !selRef.current && !colSelRef.current) {
      setSelection({ start: { ...cur }, end: { ...cur } });
    }
    let newCol = cur.col, newLine = cur.line;
    if (ctrl) {
      const line = ls[cur.line];
      let c = cur.col - 1;
      while (c > 0 && /\s/.test(line[c])) c--;
      while (c > 0 && /\w/.test(line[c - 1])) c--;
      while (c > 0 && /[^a-zA-Z0-9_]/.test(line[c - 1]) && !/\s/.test(line[c - 1])) c--;
      newCol = Math.max(0, c);
    } else if (cur.col > 0) {
      newCol = cur.col - 1;
    } else if (cur.line > 0) {
      newLine = cur.line - 1;
      newCol = ls[cur.line - 1].length;
    }
    const nc = { line: newLine, col: newCol };
    desiredColRef.current = newCol;
    setCursor(nc);
    if (shift && selRef.current) setSelection(prev => prev ? { ...prev, end: nc } : null);
    else if (!shift) { setSelection(null); setColumnSel(null); }
  }, [signalActivity]);

  const moveRight = useCallback((shift: boolean, ctrl: boolean) => {
    const cur = { ...cursorRef.current };
    const ls = linesRef.current;
    signalActivity();
    if (shift && !selRef.current && !colSelRef.current) {
      setSelection({ start: { ...cur }, end: { ...cur } });
    }
    let newCol = cur.col, newLine = cur.line;
    if (ctrl) {
      const line = ls[cur.line];
      let c = cur.col;
      while (c < line.length && /\s/.test(line[c])) c++;
      while (c < line.length && /\w/.test(line[c])) c++;
      while (c < line.length && /[^a-zA-Z0-9_]/.test(line[c]) && !/\s/.test(line[c])) c++;
      newCol = c;
    } else if (cur.col < ls[cur.line].length) {
      newCol = cur.col + 1;
    } else if (cur.line < ls.length - 1) {
      newLine = cur.line + 1;
      newCol = 0;
    }
    const nc = { line: newLine, col: newCol };
    desiredColRef.current = newCol;
    setCursor(nc);
    if (shift && selRef.current) setSelection(prev => prev ? { ...prev, end: nc } : null);
    else if (!shift) { setSelection(null); setColumnSel(null); }
  }, [signalActivity]);

  const moveUp = useCallback((shift: boolean) => {
    const cur = { ...cursorRef.current };
    signalActivity();
    if (shift && !selRef.current) setSelection({ start: { ...cur }, end: { ...cur } });
    if (cur.line > 0) {
      const newLine = cur.line - 1;
      const newCol = Math.min(desiredColRef.current, linesRef.current[newLine].length);
      const nc = { line: newLine, col: newCol };
      setCursor(nc);
      if (shift && selRef.current) setSelection(prev => prev ? { ...prev, end: nc } : null);
    }
    if (!shift) { setSelection(null); setColumnSel(null); }
  }, [signalActivity]);

  const moveDown = useCallback((shift: boolean) => {
    const cur = { ...cursorRef.current };
    signalActivity();
    if (shift && !selRef.current) setSelection({ start: { ...cur }, end: { ...cur } });
    if (cur.line < linesRef.current.length - 1) {
      const newLine = cur.line + 1;
      const newCol = Math.min(desiredColRef.current, linesRef.current[newLine].length);
      const nc = { line: newLine, col: newCol };
      setCursor(nc);
      if (shift && selRef.current) setSelection(prev => prev ? { ...prev, end: nc } : null);
    }
    if (!shift) { setSelection(null); setColumnSel(null); }
  }, [signalActivity]);

  const moveHome = useCallback((shift: boolean) => {
    const cur = { ...cursorRef.current };
    signalActivity();
    if (shift && !selRef.current) setSelection({ start: { ...cur }, end: { ...cur } });
    const line = linesRef.current[cur.line];
    const firstNonSpace = line.search(/\S/);
    const newCol = cur.col === firstNonSpace ? 0 : (firstNonSpace === -1 ? 0 : firstNonSpace);
    const nc = { line: cur.line, col: newCol };
    desiredColRef.current = newCol;
    setCursor(nc);
    if (shift && selRef.current) setSelection(prev => prev ? { ...prev, end: nc } : null);
    if (!shift) { setSelection(null); setColumnSel(null); }
  }, [signalActivity]);

  const moveEnd = useCallback((shift: boolean) => {
    const cur = { ...cursorRef.current };
    signalActivity();
    if (shift && !selRef.current) setSelection({ start: { ...cur }, end: { ...cur } });
    const newCol = linesRef.current[cur.line].length;
    const nc = { line: cur.line, col: newCol };
    desiredColRef.current = newCol;
    setCursor(nc);
    if (shift && selRef.current) setSelection(prev => prev ? { ...prev, end: nc } : null);
    if (!shift) { setSelection(null); setColumnSel(null); }
  }, [signalActivity]);

  const pageUp = useCallback(() => {
    signalActivity();
    if (!scrollRef.current) return;
    const pageSize = Math.floor(scrollRef.current.clientHeight / LINE_HEIGHT);
    const newLine = Math.max(0, cursorRef.current.line - pageSize);
    const newCol = Math.min(desiredColRef.current, linesRef.current[newLine].length);
    setCursor({ line: newLine, col: newCol });
    setSelection(null); setColumnSel(null);
  }, [signalActivity]);

  const pageDown = useCallback(() => {
    signalActivity();
    if (!scrollRef.current) return;
    const pageSize = Math.floor(scrollRef.current.clientHeight / LINE_HEIGHT);
    const newLine = Math.min(linesRef.current.length - 1, cursorRef.current.line + pageSize);
    const newCol = Math.min(desiredColRef.current, linesRef.current[newLine].length);
    setCursor({ line: newLine, col: newCol });
    setSelection(null); setColumnSel(null);
  }, [signalActivity]);

  // ---- Column selection ----
  const columnSelect = useCallback((dir: 'left' | 'right' | 'up' | 'down') => {
    const cur = { ...cursorRef.current };
    signalActivity();
    if (!colSelRef.current) {
      const anchor = { ...cur };
      let active = { ...cur };
      switch (dir) {
        case 'left': active = { ...cur, col: Math.max(0, cur.col - 1) }; break;
        case 'right': active = { ...cur, col: cur.col + 1 }; break;
        case 'up': active = { line: Math.max(0, cur.line - 1), col: cur.col }; break;
        case 'down': active = { line: Math.min(linesRef.current.length - 1, cur.line + 1), col: cur.col }; break;
      }
      setColumnSel({ anchor, active });
      setCursor(active);
      desiredColRef.current = active.col;
      setSelection(null);
    } else {
      const prev = colSelRef.current;
      const active = { ...prev.active };
      switch (dir) {
        case 'left': active.col = Math.max(0, active.col - 1); break;
        case 'right': active.col += 1; break;
        case 'up': active.line = Math.max(0, active.line - 1); break;
        case 'down': active.line = Math.min(linesRef.current.length - 1, active.line + 1); break;
      }
      setColumnSel({ anchor: prev.anchor, active });
      setCursor(active);
      desiredColRef.current = active.col;
    }
  }, [signalActivity]);

  // ---- Clipboard ----
  const copyToClipboard = useCallback(async () => {
    const text = getSelectedText();
    if (text) await navigator.clipboard.writeText(text).catch(() => {});
  }, [getSelectedText]);

  const cutToClipboard = useCallback(async () => {
    const text = getSelectedText();
    if (text) {
      await navigator.clipboard.writeText(text).catch(() => {});
      const { lines: nl, cursor: nc } = deleteSelection([...linesRef.current], { ...cursorRef.current }, selRef.current, colSelRef.current);
      setLines(nl); setCursor(nc); desiredColRef.current = nc.col;
      setSelection(null); setColumnSel(null);
    }
  }, [getSelectedText, deleteSelection]);

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) insertText(text);
    } catch { /* clipboard not available */ }
  }, [insertText]);

  const selectAll = useCallback(() => {
    const ls = linesRef.current;
    setSelection({ start: { line: 0, col: 0 }, end: { line: ls.length - 1, col: ls[ls.length - 1].length } });
    setColumnSel(null);
  }, []);

  const clearSelections = useCallback(() => {
    setSelection(null); setColumnSel(null);
  }, []);

  // ---- Keyboard handler ----
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;
    const alt = e.altKey;

    if (ctrl && !alt) {
      switch (e.key.toLowerCase()) {
        case 'a': e.preventDefault(); selectAll(); return;
        case 'c': e.preventDefault(); copyToClipboard(); return;
        case 'x': e.preventDefault(); cutToClipboard(); return;
        case 'v': e.preventDefault(); pasteFromClipboard(); return;
      }
    }

    if (shift && alt) {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft': columnSelect('left'); return;
        case 'ArrowRight': columnSelect('right'); return;
        case 'ArrowUp': columnSelect('up'); return;
        case 'ArrowDown': columnSelect('down'); return;
      }
      return;
    }

    if (alt) return;

    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); moveLeft(shift, ctrl); return;
      case 'ArrowRight': e.preventDefault(); moveRight(shift, ctrl); return;
      case 'ArrowUp': e.preventDefault(); moveUp(shift); return;
      case 'ArrowDown': e.preventDefault(); moveDown(shift); return;
      case 'Home': e.preventDefault(); moveHome(shift); return;
      case 'End': e.preventDefault(); moveEnd(shift); return;
      case 'Enter': e.preventDefault(); handleEnter(); return;
      case 'Backspace': e.preventDefault(); handleBackspace(); return;
      case 'Delete': e.preventDefault(); handleDelete(); return;
      case 'Tab': e.preventDefault(); handleTab(shift); return;
      case 'Escape': clearSelections(); return;
      case 'PageUp': e.preventDefault(); pageUp(); return;
      case 'PageDown': e.preventDefault(); pageDown(); return;
    }

    if (e.key.length === 1 && !ctrl) {
      e.preventDefault();
      insertText(e.key);
    }
  }, [selectAll, copyToClipboard, cutToClipboard, pasteFromClipboard, columnSelect, moveLeft, moveRight, moveUp, moveDown, moveHome, moveEnd, handleEnter, handleBackspace, handleDelete, handleTab, clearSelections, pageUp, pageDown, insertText]);

  // ---- Mouse handlers ----
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      setAutoScroll({ oy: e.clientY, cy: e.clientY, ox: e.clientX, cx: e.clientX });
      return;
    }
    if (e.button !== 0) return;
    const pos = getCursorFromMouse(e);
    signalActivity();

    if (e.altKey) {
      isAltDragRef.current = true;
      setColumnSel({ anchor: { ...pos }, active: { ...pos } });
      setCursor(pos); desiredColRef.current = pos.col;
      setSelection(null);
      return;
    }

    if (e.shiftKey) {
      const start = selRef.current?.start || { ...cursorRef.current };
      setSelection({ start, end: pos });
      setCursor(pos); desiredColRef.current = pos.col;
      return;
    }

    isDraggingRef.current = true;
    dragStartRef.current = pos;
    setSelection(null); setColumnSel(null);
    setCursor(pos); desiredColRef.current = pos.col;
  }, [getCursorFromMouse, signalActivity]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (autoScroll) {
      setAutoScroll(prev => prev ? { ...prev, cy: e.clientY, cx: e.clientX } : null);
      return;
    }
    if (isAltDragRef.current) {
      const pos = getCursorFromMouse(e);
      setColumnSel(prev => prev ? { ...prev, active: pos } : null);
      setCursor(pos);
      return;
    }
    if (isDraggingRef.current && dragStartRef.current) {
      const pos = getCursorFromMouse(e);
      setSelection({ start: dragStartRef.current, end: pos });
      setCursor(pos);
    }
  }, [autoScroll, getCursorFromMouse]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (e.button === 1) { setAutoScroll(null); return; }
    if (e.button === 0) {
      isDraggingRef.current = false;
      isAltDragRef.current = false;
    }
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
    setScrollLeft(e.currentTarget.scrollLeft);
  }, []);

  // ---- Minimap click ----
  const handleMinimapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const ratio = y / (rect.height - 8);
    const targetLine = Math.floor(ratio * linesRef.current.length);
    const newLine = Math.max(0, Math.min(targetLine, linesRef.current.length - 1));
    const newCol = Math.min(cursorRef.current.col, linesRef.current[newLine].length);
    setCursor({ line: newLine, col: newCol });
    desiredColRef.current = newCol;
    signalActivity();
  }, [signalActivity]);

  // ---- Tokenized lines ----
  const tokenizedLines = useMemo(() => {
    let inBlock = false;
    return lines.map(line => {
      const r = tokenizeLine(line, inBlock);
      inBlock = r.inBlockComment;
      return r.tokens;
    });
  }, [lines]);

  const maxLineWidth = useMemo(() => {
    return Math.max(...lines.map(l => l.length), 80) * charWidth + 200;
  }, [lines, charWidth]);

  // ---- Render selection ----
  const renderSelection = () => {
    const rects: React.ReactNode[] = [];
    if (selection) {
      const s = compareCursors(selection.start, selection.end) <= 0 ? selection.start : selection.end;
      const e = compareCursors(selection.start, selection.end) <= 0 ? selection.end : selection.start;
      if (s.line === e.line) {
        rects.push(<div key="ns0" className="selection-rect" style={{ top: s.line * LINE_HEIGHT, left: s.col * charWidth, width: (e.col - s.col) * charWidth || charWidth, height: LINE_HEIGHT }} />);
      } else {
        rects.push(<div key="ns0" className="selection-rect" style={{ top: s.line * LINE_HEIGHT, left: s.col * charWidth, width: Math.max((lines[s.line].length - s.col) * charWidth, charWidth), height: LINE_HEIGHT }} />);
        for (let i = s.line + 1; i < e.line; i++) {
          rects.push(<div key={`ns${i}`} className="selection-rect" style={{ top: i * LINE_HEIGHT, left: 0, width: Math.max(lines[i].length * charWidth, charWidth), height: LINE_HEIGHT }} />);
        }
        rects.push(<div key="nse" className="selection-rect" style={{ top: e.line * LINE_HEIGHT, left: 0, width: e.col * charWidth || charWidth, height: LINE_HEIGHT }} />);
      }
    }
    if (columnSel) {
      const minL = Math.min(columnSel.anchor.line, columnSel.active.line);
      const maxL = Math.max(columnSel.anchor.line, columnSel.active.line);
      const minC = Math.min(columnSel.anchor.col, columnSel.active.col);
      const maxC = Math.max(columnSel.anchor.col, columnSel.active.col);
      for (let i = minL; i <= maxL; i++) {
        rects.push(<div key={`cs${i}`} className="selection-rect" style={{ top: i * LINE_HEIGHT, left: minC * charWidth, width: (maxC - minC) * charWidth || charWidth, height: LINE_HEIGHT }} />);
      }
    }
    return rects;
  };

  // Minimap colors
  const getMinimapColor = (line: string): string => {
    const t = line.trimStart();
    if (!t) return 'transparent';
    if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return 'rgba(106,153,85,0.5)';
    if (t.startsWith('#')) return 'rgba(197,134,192,0.5)';
    if (/\b(class|struct|enum)\b/.test(t)) return 'rgba(78,201,176,0.4)';
    return 'rgba(212,212,212,0.15)';
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: '#1e1e1e' }}>
      {/* Gutter */}
      <div ref={gutterRef} style={{
        width: GUTTER_WIDTH, minWidth: GUTTER_WIDTH, overflow: 'hidden',
        background: '#1e1e1e', borderRight: '1px solid #333',
        userSelect: 'none', position: 'relative',
      }}>
        <div style={{ transform: `translateY(-${scrollTop}px)` }}>
          {lines.map((_, i) => (
            <div key={i} className="gutter-line code-font" style={{
              height: LINE_HEIGHT, display: 'flex', alignItems: 'center',
              justifyContent: 'flex-end', paddingRight: 16,
              color: i === cursor.line ? '#c6c6c6' : '#858585',
              background: i === cursor.line ? '#2a2d2e' : 'transparent',
              fontSize: 13, transition: 'color 0.1s, background 0.1s',
            }}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Code area */}
      <div
        ref={scrollRef}
        className="editor-scroll-area vscode-scroll"
        style={{ flex: 1, overflow: 'auto', position: 'relative', outline: 'none', cursor: 'text' }}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        tabIndex={0}
        autoFocus
      >
        <div style={{ position: 'relative', width: maxLineWidth, minHeight: '100%', height: lines.length * LINE_HEIGHT }}>
          {/* Active line highlight */}
          <div style={{
            position: 'absolute', left: -scrollLeft, right: 0,
            top: cursor.line * LINE_HEIGHT, height: LINE_HEIGHT,
            background: '#2a2d2e', transition: 'top 0.07s linear, left 0s',
            pointerEvents: 'none', zIndex: 1,
          }} />

          {/* Selection */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
            {renderSelection()}
          </div>

          {/* Code lines */}
          <div style={{ position: 'relative', zIndex: 3, pointerEvents: 'none' }}>
            {tokenizedLines.map((tokens, i) => (
              <div key={i} style={{ height: LINE_HEIGHT, whiteSpace: 'pre' }} className="code-font">
                {tokens.map((t, j) => (
                  <span key={j} style={{ color: TOKEN_COLORS[t.type] }}>{t.text}</span>
                ))}
              </div>
            ))}
          </div>

          {/* Cursor */}
          <div
            className={`editor-cursor ${typing ? 'typing' : cursorVisible ? '' : 'blinking'}`}
            style={{
              left: cursor.col * charWidth,
              top: cursor.line * LINE_HEIGHT,
              height: LINE_HEIGHT,
            }}
          />

          {/* Column cursor ghosts */}
          {columnSel && (() => {
            const minL = Math.min(columnSel.anchor.line, columnSel.active.line);
            const maxL = Math.max(columnSel.anchor.line, columnSel.active.line);
            const minC = Math.min(columnSel.anchor.col, columnSel.active.col);
            const maxC = Math.max(columnSel.anchor.col, columnSel.active.col);
            const ghosts: React.ReactNode[] = [];
            for (let i = minL; i <= maxL; i++) {
              if (i === cursor.line) continue;
              ghosts.push(
                <div key={i} className="column-cursor" style={{
                  left: minC * charWidth, top: i * LINE_HEIGHT, height: LINE_HEIGHT, opacity: 0.6,
                }} />,
                <div key={`r${i}`} className="column-cursor" style={{
                  left: maxC * charWidth, top: i * LINE_HEIGHT, height: LINE_HEIGHT, opacity: 0.6,
                }} />
              );
            }
            return ghosts;
          })()}

          {/* Particles */}
          {particles.map(p => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: p.x, top: p.y, width: 3, height: 3,
                backgroundColor: p.color,
                '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Minimap */}
      <div
        className="minimap"
        onClick={handleMinimapClick}
        style={{ width: 64, background: '#1e1e1e', borderLeft: '1px solid #333', position: 'relative', overflow: 'hidden', flexShrink: 0 }}
      >
        <div style={{ padding: '4px 4px', transform: 'scaleY(0.85)', transformOrigin: 'top left' }}>
          {lines.map((line, i) => {
            const w = Math.min(line.length * 0.55, 56);
            return (
              <div key={i} style={{ height: 3, marginBottom: 0.5, position: 'relative' }}>
                <div style={{
                  width: Math.max(w, line.trim() ? 8 : 0), height: '100%',
                  background: getMinimapColor(line), borderRadius: 1,
                }} />
              </div>
            );
          })}
        </div>
        {/* Viewport indicator */}
        {scrollRef.current && (() => {
          const ch = scrollRef.current?.clientHeight || 600;
          const th = lines.length * LINE_HEIGHT || 1;
          const mmH = lines.length * 3.5 * 0.85 + 8;
          const ratio = scrollTop / th;
          const vpTop = ratio * mmH + 4;
          const vpH = (ch / th) * mmH;
          return (
            <div className="minimap-viewport" style={{ top: vpTop, height: Math.max(vpH, 20) }} />
          );
        })()}
      </div>

      {/* Auto-scroll indicator */}
      {autoScroll && (
        <div className="auto-scroll-indicator" style={{ left: autoScroll.ox, top: autoScroll.oy }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
            ●
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
