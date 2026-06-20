import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface XTermTerminalProps {
  onData: (data: string) => void;
  onResize?: (cols: number, rows: number) => void;
  writeCallback?: (write: (data: string) => void) => void;
}

const XTermTerminal = ({
  onData,
  onResize,
  writeCallback,
}: XTermTerminalProps) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
      fontSize: 14,
      theme: {
        background: '#0a0a0a',
      },
    });

    const fitAddon = new FitAddon();

    term.loadAddon(fitAddon);
    term.open(terminalRef.current);

    fitAddon.fit();

    writeCallback?.((data: string) => {
      term.write(data);
    });

    term.onData((data) => {
      onData(data);
    });

    const handleResize = () => {
      fitAddon.fit();

      if (onResize) {
        onResize(term.cols, term.rows);
      }
    };

    window.addEventListener('resize', handleResize);

    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default XTermTerminal;