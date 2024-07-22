import React, { useState } from 'react';

interface CallData {
  startPhraseFound: boolean;
  endPhraseFound: boolean;
  custSentiment: string;
  custSentimentScore: string;
}

function App() {
  const [startPhrase, setStartPhrase] = useState('');
  const [endPhrase, setEndPhrase] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<CallData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (startPhrase && endPhrase && file) {
      const formData = new FormData();
      formData.append('startPhrase', startPhrase);
      formData.append('endPhrase', endPhrase);
      formData.append('file', file);

      setLoading(true);

      try {
        const response = await fetch('http://localhost:3104/calls/analyze', {
          method: 'POST',
          body: formData,
        });
        const data: CallData = await response.json();
        setData(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
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
      <p>Upload MP3 File</p>
      <input type="file" accept=".mp3,.wav,.ogg,.oga,.m4a,.mp4,.mpeg,.mpga,.webm" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
      <button onClick={handleFetch}>Enter</button>

      {loading && <p>Loading...</p>}

      {data && !loading && (
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
