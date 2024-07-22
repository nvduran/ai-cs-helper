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

  const getBorderColor = (found: boolean) => (found ? 'green' : 'red');

  return (
    <div className='big-centering-div'>
      <h1>Call Analyzer</h1>
      <div className='centered-row-container'>
        <div className='centered-column-container'>
          <p>Enter Starting Phrase</p>
          <input type="text" value={startPhrase} onChange={(e) => setStartPhrase(e.target.value)} />
        </div>
        <div className='centered-column-container'>
          <p>Enter Ending Phrase</p>
          <input type="text" value={endPhrase} onChange={(e) => setEndPhrase(e.target.value)} />
        </div>
        <div className='centered-column-container'>
          <p>Upload MP3 File</p>
          <input type="file" accept=".mp3,.wav,.ogg,.oga,.m4a,.mp4,.mpeg,.mpga,.webm" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
        </div>
      </div>
      <div className='centered-row-container'>
        <button onClick={handleFetch}>Analyze →</button>
      </div>

      {loading && <p>Loading...</p>}

      {data && !loading && (
        <div className='results-container'>
          <h2>Results</h2>
          <div className='centered-row-container'>
          <div
            className='reslts-result-cont'
            style={{ border: `2px solid ${getBorderColor(data.startPhraseFound)}` }}
          >
            <strong>Start Phrase Found:</strong> {data.startPhraseFound ? 'Yes' : 'No'}
          </div>
          <div
            className='reslts-result-cont'
            style={{ border: `2px solid ${getBorderColor(data.endPhraseFound)}` }}
          >
            <strong>End Phrase Found:</strong> {data.endPhraseFound ? 'Yes' : 'No'}
          </div>
          </div>
          <div className='reslts-result-cont'><strong>Customer Sentiment Score:</strong> <h3>{data.custSentimentScore}</h3></div>
          <div className='reslts-result-cont'><strong style={{width: "80%"}}>Customer Sentiment:</strong> {data.custSentiment}</div>
        </div>
      )}
    </div>
  );
}

export default App;
