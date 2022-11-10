import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage(){

  const [state, setState] = useState({
    seenIndexes: [],
    values: {},
    index: '',
    errorMessage: null
  });

  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const getValues = async () => {
    try{
      const valuesJson = await fetch('/api/values/current');
      const newValues = await valuesJson.json();
      setValues(newValues)
    } catch (err) {
      console.log('ERROR in getValues: ', err)
      setErrorMessage('Error while retrieving data');
    }
    
  }

  const getSeenIndexes = async () => {
    try{
      const seenIndexesJson = await fetch('/api/values/all');
      const newSeenIndexes = await seenIndexesJson.json();
      setSeenIndexes(newSeenIndexes)
    } catch (err) {
      console.log('ERROR in getSeenIndexes: ', err)
      setErrorMessage('Error while retrieving data');
    }
  }

  const renderSeenIndexes = () => {
    return seenIndexes.map(({number}) => number).join(', ');
  };

  const renderValues = () => {
    const entries = [];

    for(let key in values){
      entries.push(
        <div key={key}>
          For index {key}, I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    console.log('react submit index', index)

    const res = await fetch('/api/values', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        index: index
      })
    });

    const json = await res.json();

    console.log('handle submit response ', json)

    setIndex('');
    getValues();
    getSeenIndexes();
  }

  useEffect(() => {
      getValues();
      getSeenIndexes();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Fib Calculator!!!</h2>
      { errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>Enter your index:</label>
        <input type='text' value={index} onChange={e => setIndex(e.currentTarget.value)} />
        <button type='submit'>Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      {
        renderSeenIndexes()
      }
      <h3>Calculated values:</h3>
      {
        renderValues()
      }
      <Link to="/other">Other Page</Link>
    </div>
  );
}

export default HomePage;