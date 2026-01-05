import { Brain } from 'lucide-react';

interface AgentLogProps {
  logs: string[];
  isProcessing: boolean;
}

export default function AgentLog({ logs, isProcessing }: AgentLogProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">Agent Reasoning Log</h3>
      </div>

      <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm min-h-[200px] max-h-[300px] overflow-y-auto">
        {logs.length === 0 && !isProcessing ? (
          <p className="text-slate-500 text-center py-8">Waiting for query...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="text-green-400 mb-2">
              <span className="text-green-500">&gt; </span>
              {log}
            </div>
          ))
        )}
        {isProcessing && (
          <div className="text-green-400">
            <span className="text-green-500">&gt; </span>
            <span className="animate-pulse">Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}
