import { useState, useEffect } from 'react';
import { CreditCard, Send } from 'lucide-react';
import Sidebar from './components/Sidebar';
import AgentLog from './components/AgentLog';
import BenefitCard from './components/BenefitCard';
import { supabase } from './lib/supabase';
import { extractTextFromPDF } from './utils/pdfExtractor';
import { getSessionId } from './utils/sessionManager';
import { Location, Language, BenefitResponse } from './types';

function App() {
  const [cardNumber] = useState('4111 XXXX XXXX 1234');
  const [location, setLocation] = useState<Location>('IIT Madras Main Gate');
  const [language, setLanguage] = useState<Language>('English');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfContent, setPdfContent] = useState<string>('');
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [benefit, setBenefit] = useState<BenefitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const sessionId = getSessionId();

  useEffect(() => {
    if (uploadedFile) {
      handlePDFUpload();
    }
  }, [uploadedFile]);

  const handlePDFUpload = async () => {
    if (!uploadedFile) return;

    try {
      const text = await extractTextFromPDF(uploadedFile);
      setPdfContent(text);

      await supabase.from('uploaded_documents').insert({
        filename: uploadedFile.name,
        file_size: uploadedFile.size,
        content: text,
        user_session: sessionId,
      });
    } catch (err) {
      console.error('PDF extraction error:', err);
    }
  };

  const addLog = (log: string) => {
    setAgentLogs((prev) => [...prev, log]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);
    setAgentLogs([]);
    setBenefit(null);

    try {
      addLog(`Initializing Agentic Engine for ${cardNumber}...`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      addLog(`Setting Geofence: ${location}`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      addLog(`Scanning uploaded Visa PDFs for benefits...`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      addLog(`Generating benefit draft with Gemini AI...`);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-benefit`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          location,
          language,
          pdfContent,
          cardNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify benefit');
      }

      const data = await response.json();

      if (data.benefit) {
        setBenefit(data.benefit);

        await supabase.from('benefit_queries').insert({
          card_number_masked: cardNumber,
          location,
          language,
          query,
          benefit_response: data.benefit,
          reasoning_log: agentLogs,
          user_session: sessionId,
        });

        addLog('Benefit verification complete!');
      } else {
        setError(data.error || 'Unable to verify benefit');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to process request. Please try again.');

      const fallbackBenefit: BenefitResponse = {
        benefit: 'Demo: Location-Based Cashback',
        details: `As you're at ${location}, enjoy special cashback benefits on your Visa card transactions.`,
        condition: 'As per Visa Terms & Conditions',
        source: 'Demo / Sample Benefit (AI service unavailable)',
      };

      setBenefit(fallbackBenefit);
      addLog('Using fallback demo benefit');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        cardNumber={cardNumber}
        location={location}
        language={language}
        uploadedFile={uploadedFile}
        contextChars={pdfContent.length}
        onLocationChange={setLocation}
        onLanguageChange={setLanguage}
        onFileUpload={setUploadedFile}
        onFileRemove={() => {
          setUploadedFile(null);
          setPdfContent('');
        }}
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Visa Benefit Buddy</h1>
          </div>
          <div className="mt-2 text-sm text-slate-600">
            <span className="font-semibold">Agent Status:</span> Ready |{' '}
            <span className="font-semibold">Current Location:</span> {location}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <AgentLog logs={agentLogs} isProcessing={isProcessing} />
            <BenefitCard benefit={benefit} error={error} />
          </div>
        </div>

        <div className="bg-white border-t border-slate-200 px-8 py-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about your Visa card benefits..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={isProcessing || !query.trim()}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              {isProcessing ? 'Processing...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
