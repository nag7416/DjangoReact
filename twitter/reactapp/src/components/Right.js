import { NavLink } from "react-router-dom"

export default function Right(){
    return (
        <>
            <div className="right">
                <div className="searchcon">
                    <div className="searchinner">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-14j79pv r-4wgw6l r-f727ji"><g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg>
                        <input type="text" placeholder="Search" />
                    </div>
                </div>


                <div className="premium">
                    <div className="premiuminner">
                        <h3>Subscribe to Premium</h3>
                        <p>Subscribe to unlock new features and id eligible, receive a sahre of ads revenue</p>
                        <button>Subscribe</button>
                    </div>
                </div>

                <div className="whats">
                    <h3>What's happening</h3>
                    <div className="lists">
                        <NavLink to='/'>
                            <div className="list">
                                <div className="top">
                                    <label>Sports &bull; Trending</label>
                                </div>
                                <div className="bottom">
                                    <p>#MotoG34</p>
                                </div>
                            </div>
                        </NavLink>
                        <NavLink to='/'>
                            <div className="list">
                                <div className="top">
                                    <label>Politics &bull; Trending in India</label>
                                </div>
                                <div className="bottom">
                                    <p>#TsPolitics</p>
                                </div>
                            </div>
                        </NavLink>
                        <NavLink to='/'>
                            <div className="list">
                                <div className="top">
                                    <label>Olympics &bull; World Trending</label>
                                </div>
                                <div className="bottom">
                                    <p>#JavlineThrow</p>
                                </div>
                            </div>
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}