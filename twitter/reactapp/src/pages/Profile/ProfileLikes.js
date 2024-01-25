import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { NavLink, useParams } from "react-router-dom";
import LazyImage from "../LazyImage";
import author from '../../assets/author.png';
import placeholder from '../../assets/placeholder.jpg';


export default function ProfileLikes({ currentUser }){
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [delayedLoading, setDelayedLoading] = useState(false);
    const username = useParams();

    useEffect(() => {
        fetch(`http://localhost:8000/api/${username.username}/user_liked_posts`, {
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
                throw new Error('Failed to fetch user liked posts')
            }
        })
        .then(data => {
            setPosts(data);
        })
    }, [])

    const likeToggle = (e) => {
        const postId = e.currentTarget.dataset.post_id;
        const svgItem = e.currentTarget.querySelector('svg');
        const labelElem = e.currentTarget.querySelector('label');
    
        fetch(`http://localhost:8000/${postId}/like`, {
            method: 'PUT',
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Failed to like the post");
            }
        })
        .then(data => {
            setPosts(prevPosts => {
                return prevPosts.map(post => (
                    post.id === postId ? { ...post, liked: data.liked } : post
                ));
            });
            if (data.liked === true) {
                labelElem.innerHTML++;
            } else {
                labelElem.innerHTML--;
            }
        })
        .catch(error => {
            console.error("Error while liking the post:", error);
        });
    };

    return (
        <>
        <Helmet>
            <title> Posts liked by {currentUser.name}</title>
        </Helmet>
        <div className="posts">
            {isLoading ? (
                <div className='loader'>
                    <span id='loader'></span>
                </div>
            ):(
                <>
                {posts && posts.length > 0 ? (
                    <>
                        {posts.map(post => (
                            <div className="post" key={post.id}>
                                <div className="postleft">
                                    <div className="postuser_img">
                                        <NavLink to={`/${currentUser.user}`}>
                                            <LazyImage src={author} data-real-src={post.user_img} alt={post.id} />
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="postright">
                                    <div className="postrighttop">
                                        <div className="postrightname">
                                            <NavLink to={`/${currentUser.user}`}>
                                                <label>{post.name}</label>
                                                <span>@{post.user} &bull; {post.published}</span>
                                            </NavLink>
                                        </div>
                                        <div className="postrightoption">
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                                        </div>
                                    </div>
                                    <div className="postcontent">
                                        <p dangerouslySetInnerHTML={{__html: post.description}}></p>
                                    </div>
        
                                    <div className="postimg">
                                        <NavLink to='/'>
                                            <LazyImage src={placeholder} data-real-src={post.image} alt={post.id} />
                                        </NavLink>
                                    </div>
        
                                    <div className="post_bottom">
                                        <div className="comment">
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
                                            <label>{post.comment}</label>
                                        </div>
                                        <div className="retweet">
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
                                            <label>2.2K</label>
                                        </div>
                                        <div className="like" data-post_id={post.id} onClick={likeToggle}>
                                            {post.liked ? (
                                                <svg style={{fill: 'rgb(249, 24, 128)'}} viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-50lct3 r-1srniue"><g><path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
                                            ):(
                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
                                            )}
                                            {post.liked ? (
                                                <label style={{color: 'rgb(249, 24, 128)'}}>{post.like}</label>
                                            ):(
                                                <label>{post.like}</label>
                                            )}
                                            
                                        </div>
                                        <div className="save">
                                            {post.bookmarked ? (
                                                <svg style={{fill: 'dodgerblue'}} viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-50lct3 r-1srniue"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></g></svg>
                                            ):(
                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></g></svg>
                                            )}
                                            <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                            
                        </>
                    ):(
                        <label style={{width: '100%', textAlign: 'center'}}>This user doesn't liked any posts</label>
                    )}
                    
                    </>
                )}
            </div>
        </>
    )
}