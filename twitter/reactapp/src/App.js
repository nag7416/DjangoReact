import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import { useEffect, useState } from 'react';
import Profile from './pages/Profile/Profile';
import Messages from './pages/Messages';
import Grok from './pages/Grok';
import Lists from './pages/Lists';
import Bookmarks from './pages/Bookmarks';
import TrendDetail from './pages/TrendDetail';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import ProfileSetting from './pages/ProfileSetting';


function App() {
  const [userdata, setUserData] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/user', {
            method: 'GET', 
            credentials: 'include',
        })
        .then(response => {
            if(response.status === 200){
                setTimeout(() => {
                    // setIsLoading(false);
                }, 2000);
                return response.json();
            } 
            else if (response.status === 500){
              console.log('something');
            }
            else {
                throw new Error('Failed to fetch user...')
            }
        })
        .then(data => {
          console.log(data);
            setUserData(data[0]);
            setPosts(data[0].user_posts);
        })
  }, [])
  return (
    <>
    <Routes>
      <Route path='/' element={<Home userdata={userdata} />}></Route>
      <Route path='/settings/profile' element={<ProfileSetting userdata={userdata} />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/explore' element={<Explore userdata={userdata} />}></Route>
      <Route path='/messages' element={<Messages userdata={userdata} />}></Route>
      <Route path='/grok' element={<Grok userdata={userdata} />}></Route>
      <Route path='/lists' element={<Lists userdata={userdata} />}></Route>
      <Route path='/bookmarks' element={<Bookmarks userdata={userdata} />}></Route>
      <Route path='/:username/status/:post_id' element={<PostDetail userdata={userdata} />}></Route>

      <Route path='/trend/:name' element={<TrendDetail userdata={userdata} />}></Route>

      <Route path='/explore/tabs/for-you' element={<Explore userdata={userdata} />}></Route>
      <Route path='/explore/tabs/trending' element={<Explore userdata={userdata} />}></Route>
      <Route path='/explore/tabs/news' element={<Explore userdata={userdata} />}></Route>
      <Route path='/explore/tabs/sports' element={<Explore userdata={userdata} />}></Route>
      <Route path='/explore/tabs/entertainment' element={<Explore userdata={userdata} />}></Route>



      <Route path='/notifications' element={<Notifications userdata={userdata} />}></Route>
      <Route path='/notifications/verified' element={<Notifications userdata={userdata} />}></Route>
      <Route path='/notifications/mentions' element={<Notifications userdata={userdata} />}></Route>


      <Route path='/:username' element={<Profile userdata={userdata} posts={posts} />}></Route>
      <Route path='/:username/replies' element={<Profile userdata={userdata} posts={posts} />}></Route>
      <Route path='/:username/media' element={<Profile userdata={userdata} posts={posts} />}></Route>
      <Route path='/:username/likes' element={<Profile userdata={userdata} posts={posts} />}></Route>
    </Routes>
    </>
  );
}

export default App;
