import { Link } from 'react-router-dom';

function OtherPage(){
  return (
    <div>
      <h1>Other page</h1>
      <p>lol</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default OtherPage;