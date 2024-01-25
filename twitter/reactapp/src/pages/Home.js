import { Helmet } from 'react-helmet';
import Left from '../components/Left';
import Right from '../components/Right';
import { NavLink, useHistory, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import author from '../assets/author.png';
import placeholder from '../assets/placeholder.jpg';
import LazyImage from './LazyImage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Home({ userdata }){
    const [text, setText] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [delayedLoading, setDelayedLoading] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const [postText, setPostText] = useState('');
    const isPostButtonDisabled = postText.trim() === '';
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const imageInputRef = useRef(null);
    const maxWords = 50;



    const handleInputChange = (event) => {
        const inputText = event.target.value;
        const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    
        if (words.length > maxWords) {
          setText(words.slice(0, maxWords).join(' '));
        } else {
          setText(inputText);
        }
    
        const currentWordCount = Math.min(words.length, maxWords);
        setWordCount(currentWordCount);

        
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);

        // if (imageInputRef.current) {
        //     imageInputRef.current.value = '';
        // }
    }
    const isButtonDisabled = wordCount < 1;


    const fetchPosts = () => {
        fetch('http://localhost:8000/api/posts', {
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
                throw new Error('Failed to fetch posts...')
            }
        })
        .then(data => {
            setPosts(data);
            setTags(data[0].tags);
            
        })
    }
    useEffect(() => {
        
        fetchPosts();
        




        const options = {
            root: null, // Use the viewport as the root
            rootMargin: '0px', // No margin
            threshold: 0.5, // Trigger when 50% of the container is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    target.src = target.getAttribute('data-real-src'); // Replace src with data-real-src
                    observer.unobserve(containerRef.current);
                }
            });
        }, options);

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };

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
    const bookmarkToggle = (e) => {
        const postId = e.currentTarget.dataset.post_id;
        const svgItem = e.currentTarget.querySelector('svg');
        const labelElem = e.currentTarget.querySelector('label');

        fetch(`http://localhost:8000/${postId}/bookmark`, {
            method: 'PUT',
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Failed to bookmark the post");
            }
        })
        .then(data => {
            setPosts(prevPosts => {
                return prevPosts.map(post => (
                    post.id === postId ? { ...post, bookmarked: data.bookmarked } : post
                ));
            });
            // if (data.bookmarked === true) {
            //     labelElem.innerHTML++;
            // } else {
            //     labelElem.innerHTML--;
            // }
        })
        .catch(error => {
            console.error("Error while bookmarking the post:", error);
        });
    }
    const handlePostSubmit = async (e) => {
        e.preventDefault();

        if(postText.trim() !== ''){
            const formData = new FormData();
            formData.append('description', postText);
            if(selectedImage){
                formData.append('image', selectedImage);
            }

            setIsSubmitting(true);

            try {
                const rootElement = document.getElementById('root'); // Adjust the ID based on your root element
                const csrfToken = rootElement.getAttribute('data-csrf');

                const response = await fetch('http://localhost:8000/api/post_upload/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include',
                    body: formData,
                });
                if (response.status === 200) {
                    fetchPosts();
                } else {
                    console.error('Error uploading post:', response.statusText);
                }
            } catch (error) {
                console.error('error uploading post', error);
            } finally {
                setIsSubmitting(false);
                setPostText('');
                setSelectedImage(null);
            }
        }
    }

    return (
        <>
            <Helmet>
                <title>Home / X</title>
            </Helmet>
            <div className='main'>
                <div className='inner'>
                    <Left userdata={userdata} />
                        <div className="center">
                            <div className="centerinner" ref={containerRef}>
                                <div className="centertop">
                                    <button className="active">
                                        <label>For you</label>
                                    </button>
                                    <button>
                                        <label>Following</label>
                                    </button>
                                    <div className="setting">
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03" style={{color: 'rgb(15, 20, 25)'}}><g><path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path></g></svg>
                                    </div>
                                </div>

                                <div className="writepost">
                                    <div className="writepostleft">
                                        <div className="writeuserimg">
                                            <NavLink to={`/${userdata.user}`}>
                                                <LazyImage src={author} data-real-src={userdata.profile_img} alt={userdata.id} />
                                            </NavLink>
                                        </div>
                                    </div>
                                    <div className="writepostright">
                                        <form onSubmit={handlePostSubmit} encType="multipart/form-data">
                                            <div className="userinput">
                                                <textarea value={postText} onChange={(e) => setPostText(e.target.value)} rows="4" placeholder="What is happening?!"></textarea>
                                            </div>
                                            <input type="file" ref={imageInputRef} accept="image/*" onChange={handleImageChange} />
                                            <div className="postbottom">
                                                <div className="postbottomleft">
                                                    .
                                                </div>
                                                <div className="postbottomright">
                                                    
                                                    <div className="wordscount">
                                                        <label id="current">{wordCount}</label> / <label id="limit">{maxWords}</label>
                                                    </div>
                                                    <div className="postbtn">
                                                        <button disabled={isPostButtonDisabled} onClick={handlePostSubmit}>Post</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>


                                <div className="posts">
                                    {isLoading ? (
                                        <div className='loader'>
                                            <span id='loader'></span>
                                        </div>
                                    ):(
                                        <>
                                            {posts.map(post => (
                                                <div className="post" key={post.id}>
                                                    <div className="postleft">
                                                        <div className="postuser_img">
                                                            <NavLink to={`/${post.user}`}>
                                                                
                                                                <LazyImage src={author} data-real-src={post.user_img} alt={post.id} />
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                    <div className="postright">
                                                        <div className="postrighttop">
                                                            <div className="postrightname">
                                                                <NavLink to={`/${post.user}`}>
                                                                    <label>{post.name}</label>
                                                                    <span>@{post.user} &bull; {post.published}</span>
                                                                </NavLink>
                                                            </div>
                                                            <div className="postrightoption">
                                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                                                            </div>
                                                        </div>
                                                        <div className="postcontent">
                                                                {post.tags.map(tag => (
                                                                    <NavLink to={`trend/${tag.name}`} style={{color: 'dodgerblue'}} key={tag.id}>
                                                                        #{tag.name} &nbsp;
                                                                    </NavLink>
                                                                ))}
                                                                <NavLink to={`/${post.user}/status/${post.id}`}>
                                                                    <p dangerouslySetInnerHTML={{ __html: post.description}}></p>
                                                                </NavLink>
                                                        </div>

                                                        <div className="postimg">
                                                            <NavLink to='/'>
                                                                {post.image ? (
                                                                    <LazyImage src={placeholder} data-real-src={post.image} alt={post.id} />
                                                                ):(
                                                                    <></>
                                                                )}
                                                                
                                                            </NavLink>
                                                        </div>

                                                        <div className="post_bottom">
                                                            <div className="comment">
                                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
                                                                <label>{post.comments_count}</label>
                                                            </div>
                                                            <div className="retweet">
                                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
                                                                <label>2.2K </label>
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

                                                            <div className="comment">
                                                                <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-50lct3 r-1srniue"><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg>
                                                                <label>{post.views}</label>
                                                            </div>
                                                            
                                                            <div className="save" data-post_id={post.id} onClick={bookmarkToggle}>
                                                                {post.bookmarked ? (
                                                                    <svg style={{fill: 'rgba(29,155,240,1.00)'}} viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></g></svg>
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