import { NavLink, useLocation, useParams, useNavigate, Link } from "react-router-dom";
import Left from "../../components/Left";
import Right from "../../components/Right";
import placeholder from '../../assets/placeholder.jpg'
import author from '../../assets/author.png';
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import ProfileReplies from './ProfileReplies.js';
import ProfileMedia from './ProfileMedia.js';
import ProfileLikes from "./ProfileLikes.js";
import ProfilePage from "./ProfilePage.js";


export default function Profile({ userdata }){
    const [currentUser, setCurrentUser] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [delayedLoading, setDelayedLoading] = useState(false);
    const username = useParams();
    const location = useLocation();
    const navigate = useNavigate();


    const isProfilePage = location.pathname === `/${currentUser.user}`;
    const isRepliesPage = location.pathname === `/${currentUser.user}/replies`;
    const isMediaPage = location.pathname === `/${currentUser.user}/media`;
    const isLikesPage = location.pathname === `/${currentUser.user}/likes`;

    const goBackHandler = () => {
        navigate(-1);
    }

    useEffect(() => {
        fetch(`http://localhost:8000/api/${username.username}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => {
            if(response.status === 200){
                setIsLoading(false);
                setTimeout(() => {
                    setDelayedLoading(true);
                }, 1000);
                return response.json();
            } else {
                setIsLoading(true);
                setDelayedLoading(false);
                throw new Error('Failed to fetch user')
            }
        })
        .then(data => {
            setCurrentUser(data[0]);
            setPosts(data[0].user_posts);
        })
    }, [username.username])


    const subToggle = (e) => {
        const userId = e.currentTarget.dataset.user_id;

        fetch(`http://localhost:8000/api/${userId}/subscribe`, {
            method: 'PUT',
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Failed to follow");
            }
        })
        .then(data => {
            setCurrentUser(puser => ({
                ...puser,
                subscribed: data.subscribed,
            }))
        })
    }


    

    return (
        <>
        <Helmet>
            <title>{`${currentUser.name ? currentUser.name:""} (@${currentUser.user ? currentUser.user:""}) / X`}</title>
        </Helmet>
            <div className="main">
                <div className="inner">
                    <Left userdata={userdata} />
                    <div className="center">
                        <div className="centerinner">
                            <div className="centertop">
                                <div className="profiletop">
                                    <button>
                                        <NavLink onClick={goBackHandler}>
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03" style={{color: 'rgb(15, 20, 25)'}}><g><path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path></g></svg>
                                        </NavLink>
                                    </button>
                                    <div className="profilename">
                                        <label>{currentUser.name ? currentUser.name : 'Loading...'}</label>
                                        <span>{currentUser.posts_count ? currentUser.posts_count : "0"} posts</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profilesection">
                                <NavLink to='/'>
                                    <div className="banner" style={{backgroundImage: `url(${currentUser.banner_img})`}}>

                                    </div>
                                </NavLink>
                                <div className="followingoption">
                                    {userdata.user === currentUser.user ? (
                                        <>
                                            <button style={{display: 'none'}}></button>
                                            <button style={{display: 'none'}}></button>
                                            <Link to='/settings/profile'>
                                                <button style={{borderRadius: 'none'}}>
                                                    Edit Profile
                                                </button>
                                            </Link>
                                            
                                        </>
                                    ):(
                                        <>
                                            <button>
                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03" style={{color: 'rgb(15, 20, 25)'}}><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                                            </button>
                                            <button>
                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03" style={{color: 'rgb(15, 20, 25)'}}><g><path d="M22 5v2h-3v3h-2V7h-3V5h3V2h2v3h3zm-.86 13h-4.241c-.464 2.281-2.482 4-4.899 4s-4.435-1.719-4.899-4H2.87L4 9.05C4.51 5.02 7.93 2 12 2v2C8.94 4 6.36 6.27 5.98 9.3L5.13 16h13.73l-.38-3h2.02l.64 5zm-6.323 0H9.183c.412 1.164 1.51 2 2.817 2s2.405-.836 2.817-2z"></path></g></svg>
                                            </button>
                                            {currentUser.subscribed ? (
                                                <button style={{background: 'white', color: 'black'}} onClick={subToggle} data-user_id={currentUser.user}>
                                                    Following
                                                </button>
                                            ):(
                                                <button style={{background: 'black', color: 'white'}} onClick={subToggle} data-user_id={currentUser.user}>
                                                    Follow
                                                </button>
                                            )}
                                        </>
                                    )}
                                    
                                </div>
                                <div className="profileimgsection">
                                    <div className="profileimg">
                                        <img alt="s" src={currentUser.profile_img ? currentUser.profile_img : author} />
                                    </div>

                                    <h3>{currentUser.name ? currentUser.name : "Loading..."}</h3>
                                    <h4>@{currentUser.user ? currentUser.user : "Loading..."}</h4>
                                </div>
                                <div className="ground">
                                    <div className="profiledesc">
                                        <p>{currentUser.bio ? currentUser.bio:"Loading..."}</p>
                                    </div>
                                    <div className="details">
                                        <div>
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1d4mawv"><g><path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path></g></svg>
                                            <label>{currentUser.location ? currentUser.location : "India"}</label>
                                        </div>
                                        <div>
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1d4mawv"><g><path d="M8 10c0-2.21 1.79-4 4-4v2c-1.1 0-2 .9-2 2H8zm12 1c0 4.27-2.69 8.01-6.44 8.83L15 22H9l1.45-2.17C6.7 19.01 4 15.27 4 11c0-4.84 3.46-9 8-9s8 4.16 8 9zm-8 7c3.19 0 6-3 6-7s-2.81-7-6-7-6 3-6 7 2.81 7 6 7z"></path></g></svg>
                                            <label>Born on {currentUser.birthday}</label>
                                        </div>
                                        <div>
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-1d4mawv"><g><path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path></g></svg>
                                            <label>Joined {currentUser.joined}</label>
                                        </div>
                                    </div>
                                    <div className="followerssection">
                                        <div className="following">
                                            <label><b>2,345</b> Following</label>
                                        </div>
                                        <div className="followers">
                                            <label><b>{currentUser.subscribers}</b> {currentUser.subscribers === 1 ? "Follower":"Followers"}</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="profilebtns">
                                    <div className="profbtns">
                                        <ul>
                                            {isProfilePage ? (
                                                <li className="active">
                                                    <NavLink to={`/${currentUser.user}`}>
                                                        <button>
                                                            <label>Posts</label>
                                                        </button>
                                                    </NavLink>
                                                </li>
                                            ):(
                                                <li>
                                                    <NavLink to={`/${currentUser.user}`}>
                                                        <button>
                                                            <label>Posts</label>
                                                        </button>
                                                    </NavLink>
                                                </li>
                                            )}
                                            {isRepliesPage ? (
                                                <li className="active">
                                                    <NavLink to={`/${currentUser.user}/replies`}>
                                                        <button>
                                                            <label>Replies</label>
                                                        </button>
                                                    </NavLink>
                                                </li>
                                            ):(
                                                <li>
                                                    <NavLink to={`/${currentUser.user}/replies`}>
                                                        <button>
                                                            <label>Replies</label>
                                                        </button>
                                                    </NavLink>
                                                </li>
                                            )}
                                            {isMediaPage ? (
                                                <li className="active">
                                                    <NavLink to={`/${currentUser.user}/media`}>
                                                        <button>
                                                            <label>Media</label>
                                                        </button>
                                                    </NavLink>
                                                </li>
                                            ):(
                                                <li>
                                                    <NavLink to={`/${currentUser.user}/media`}>
                                                        <button>
                                                            <label>Media</label>
                                                        </button>
                                                    </NavLink>
                                                </li>
                                            )}
                                            {isLikesPage ? (
                                                <li className="active">
                                                    <NavLink to={`/${currentUser.user}/likes`}>
                                                        <button>
                                                            <label>Likes</label>
                                                        </button>
                                                    </NavLink>
                                                </li>
                                            ):(
                                                <li>
                                                    <NavLink to={`/${currentUser.user}/likes`}>
                                                        <button>
                                                            <label>Likes</label>
                                                        </button>
                                                    </NavLink>
                                                </li>
                                            )}
                                            
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            {isProfilePage ? (
                                <ProfilePage currentUser={currentUser} posts={posts} isLoading={isLoading} delayedLoading={delayedLoading} />
                            ):(
                                <></>
                            )}
                            {isRepliesPage ? (
                                <ProfileReplies currentUser={currentUser} />
                            ):(
                                <></>
                            )}
                            {isMediaPage ? (
                                <ProfileMedia currentUser={currentUser} />
                            ):(
                                <></>
                            )}
                            {isLikesPage ? (
                                <ProfileLikes currentUser={currentUser} />
                            ):(
                                <></>
                            )}
                        </div>
                    </div>
                    <Right />
                </div>
            </div>
        </>
    )
}