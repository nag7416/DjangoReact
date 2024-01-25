import { Helmet } from "react-helmet";
import Left from "../components/Left";
import Right from "../components/Right";
import { NavLink, useLocation } from "react-router-dom";
import Explore1 from '../pages/Explore/Explore1';
import Explore2 from '../pages/Explore/Explore2';
import Explore3 from '../pages/Explore/Explore3';
import Explore4 from "./Explore/Explore4";
import Explore5 from "./Explore/Explore5";
import { useEffect, useState } from "react";

export default function Explore({ userdata }){
    const [trends, setTrend] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const isExplore = location.pathname === '/explore';
    const isExploreForYou = location.pathname === '/explore/tabs/for-you';

    const isExploreTrending = location.pathname === '/explore/tabs/trending';
    const isExploreNews = location.pathname === '/explore/tabs/news';
    const isExploreSports = location.pathname === '/explore/tabs/sports';
    const isExploreEntertainment = location.pathname === '/explore/tabs/entertainment';

    useEffect(() => {
        fetch('http://localhost:8000/api/separate_hashtags/', {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => {
            if(response.status === 200){
                setIsLoading(false);
                return response.json()
            } else {
                setIsLoading(true);
                console.log('error');
            }
        })
        .then(data => {
            setTrend(data);
        })
    }, [])
    return (
        <>
        <Helmet>
            <title>Explore / X</title>
        </Helmet>
            <div className="main">
                <div className="inner">
                    <Left userdata={userdata} />
                        <div className="center">
                            <div className="centerinner">
                                <div className="centertop">
                                    <div className="centersearch">
                                        <form action="#">
                                            <input type="text" placeholder="Search" />
                                        </form>
                                    </div>
                                    <div className="setting">
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03" style={{color: 'rgb(15, 20, 25)'}}><g><path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path></g></svg>
                                    </div>
                                </div>
                                <div className="trend-list">
                                    <div className="btnlist">
                                        {isExplore || isExploreForYou ? (
                                            <NavLink to='/explore/tabs/for-you'>
                                                <button className="active">
                                                    <label>For you</label>
                                                </button>
                                            </NavLink>
                                        ):(
                                            <NavLink to='/explore/tabs/for-you'>
                                                <button>
                                                    <label>For you</label>
                                                </button>
                                            </NavLink>
                                        )}
                                        {isExploreTrending ? (
                                            <NavLink to='/explore/tabs/trending'>
                                                <button className="active">
                                                    <label>Trending</label>
                                                </button>
                                            </NavLink>
                                        ):(
                                            <NavLink to='/explore/tabs/trending'>
                                                <button>
                                                    <label>Trending</label>
                                                </button>
                                            </NavLink>
                                        )}
                                        {isExploreNews ? (
                                            <NavLink to='/explore/tabs/news'>
                                                <button className="active">
                                                    <label>News</label>
                                                </button>
                                            </NavLink>
                                        ):(
                                            <NavLink to='/explore/tabs/news'>
                                                <button>
                                                    <label>News</label>
                                                </button>
                                            </NavLink>
                                        )}
                                        {isExploreSports ? (
                                            <NavLink to='/explore/tabs/sports'>
                                            <button className="active">
                                                <label>Sports</label>
                                            </button>
                                        </NavLink>
                                        ):(
                                            <NavLink to='/explore/tabs/sports'>
                                            <button>
                                                <label>Sports</label>
                                            </button>
                                        </NavLink>
                                        )}
                                        {isExploreEntertainment ? (
                                            <NavLink to='/explore/tabs/entertainment'>
                                                <button className="active">
                                                    <label>Entertainment</label>
                                                </button>
                                            </NavLink>
                                        ):(
                                            <NavLink to='/explore/tabs/entertainment'>
                                                <button>
                                                    <label>Entertainment</label>
                                                </button>
                                            </NavLink>
                                        )}
                                        
                                    </div>

                                    {isExplore || isExploreForYou ? (
                                        <Explore1 />
                                    ):(
                                        <></>
                                    )}

                                    {isExploreTrending ? (
                                        <Explore2 />
                                    ):(
                                        <></>
                                    )}
                                    {isExploreNews ? (
                                        <Explore3 />
                                    ):(
                                        <></>
                                    )}

                                    {isExploreSports ? (
                                        <Explore4 />
                                    ):(
                                        <></>
                                    )}
                                    {isExploreEntertainment ? (
                                        <Explore5 />
                                    ):(
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    <Right />
                </div>
            </div>
        </>
    )
}