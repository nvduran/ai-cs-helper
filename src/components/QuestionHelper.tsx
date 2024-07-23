import React, { useState } from 'react';

interface AnswerData {
  answer: string;
}

interface Article {
  title: string;
  body: string;
}

function QuestionHelper() {
  const [question, setQuestion] = useState('');
  const [articles, setArticles] = useState<Article[]>([{ title: '', body: '' }]);
  const [data, setData] = useState<AnswerData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleArticleChange = (index: number, field: keyof Article, value: string) => {
    const newArticles = [...articles];
    newArticles[index][field] = value;
    setArticles(newArticles);
  };

  const handleAddArticle = () => {
    setArticles([...articles, { title: '', body: '' }]);
  };

  const handleRemoveArticle = (index: number) => {
    setArticles(articles.filter((_, i) => i !== index));
  };

  const handleFetch = async () => {
    if (question && articles.every(article => article.title && article.body)) {
      const payload = {
        question,
        articles,
      };
  
      setLoading(true);
  
      try {
        const response = await fetch('http://localhost:3104/question/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        const data: AnswerData = await response.json();
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
    <div className='big-centering-div'>
      <h1>Question Helper</h1>
      {articles.map((article, index) => (
        <div key={index} className='centered-row-container'>
          <div className='centered-column-container'>
            <p>Enter Article Title</p>
            <input
              type="text"
              value={article.title}
              onChange={(e) => handleArticleChange(index, 'title', e.target.value)}
            />
          </div>
          <div className='centered-column-container'>
            <p>Enter Article Body</p>
            <textarea
              value={article.body}
              onChange={(e) => handleArticleChange(index, 'body', e.target.value)}
              rows={10}
              cols={50}
            ></textarea>
          </div>
          <button className='minor-button' onClick={() => handleRemoveArticle(index)}>Remove Article</button>
        </div>
      ))}
      <div className='centered-row-container'>
        <button className='minor-button' onClick={handleAddArticle}>Add Another Article</button>
      </div>
      <div className='centered-column-container'>
        <p className='major-padding-side'>Enter Your Question</p>
        <input type="text" className='wider-input' value={question} onChange={(e) => setQuestion(e.target.value)} />
      </div>
      <div className='centered-row-container'>
        <button onClick={handleFetch}>Get Answer →</button>
      </div>

      {loading && <p>Loading...</p>}

      {data && !loading && (
        <div className='results-container'>
          <h2>Answer</h2>
          <div className='results-result-cont'><strong>Answer:</strong> {data.answer}</div>
        </div>
      )}
    </div>
  );
}

export default QuestionHelper;
