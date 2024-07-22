import { useState } from 'react';

// Define the type for your data
interface CallData {
  startPhraseFound: boolean;
  endPhraseFound: boolean;
  custSentiment: string;
  custSentimentScore: string;
}

function App() {
  const [startPhrase, setStartPhrase] = useState('');
  const [endPhrase, setEndPhrase] = useState('');
  const [data, setData] = useState<CallData | null>(null); // Initialize with the defined type

  const handleFetch = async () => {
    if (startPhrase && endPhrase) {
      try {
        const response = await fetch(`http://localhost:3104/calls/analyze?startPhrase=${encodeURIComponent(startPhrase)}&endPhrase=${encodeURIComponent(endPhrase)}`);
        const data: CallData = await response.json();
        setData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  return (
    <div>
      <h1>Call Analyzer</h1>
      <p>Enter Starting Phrase</p>
      <input type="text" value={startPhrase} onChange={(e) => setStartPhrase(e.target.value)} />
      <p>Enter Ending Phrase</p>
      <input type="text" value={endPhrase} onChange={(e) => setEndPhrase(e.target.value)} />
      <button onClick={handleFetch}>Enter</button>

      {data && (
        <div>
          <h2>Results</h2>
          <div><strong>Start Phrase Found:</strong> {data.startPhraseFound ? 'Yes' : 'No'}</div>
          <div><strong>End Phrase Found:</strong> {data.endPhraseFound ? 'Yes' : 'No'}</div>
          <div><strong>Customer Sentiment:</strong> {data.custSentiment}</div>
          <div><strong>Customer Sentiment Score:</strong> {data.custSentimentScore}</div>
        </div>
      )}
    </div>
  );
}

export default App;
