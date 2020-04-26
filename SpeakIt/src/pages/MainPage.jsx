import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';

const MainPage = () => (
  <div className="preview">
    <h1>Speak It</h1>
    <p className="text-info">
      Click on the words to hear them sound.
      <br />
      Click on the button and speak the words into the microphone.
    </p>
    <Link to={routes.GAME} exact className="btn btn-primary btn-lg">Start</Link>
  </div>
);

export default MainPage;
