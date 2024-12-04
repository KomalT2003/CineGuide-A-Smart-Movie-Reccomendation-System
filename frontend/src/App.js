import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import GetRecommendations from './pages/GetReccomendations';
import ShowRecommendations from './pages/ShowRecommendations';
import MovieDescriptionPage from './pages/MovieDescription';
import MoreLikeThisPage from './pages/MoreLikeThis';
import FriendsPage from './pages/FriendsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/get_recommendations" element={<GetRecommendations />} />
        <Route path='/show_recommendations' element={<ShowRecommendations />} />
        <Route path='/movie/:title' element={<MovieDescriptionPage />} />
        <Route path='/more_like_this/:movieName' element={<MoreLikeThisPage />} />
        <Route path= '/friends' element={<FriendsPage />} />  


      </Routes>
    </Router>
  );
}

export default App;
