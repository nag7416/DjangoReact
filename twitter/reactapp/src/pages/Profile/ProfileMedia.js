import { Helmet } from "react-helmet";
import placeholder from '../../assets/placeholder.jpg';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


export default function ProfileMedia({ currentUser }){
    const [media, setMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const username = useParams();

    useEffect(() => {
        fetch(`http://localhost:8000/api/${username.username}/user_media`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(response => {
            if(response.status === 200){
                setIsLoading(false);
                return response.json();
            } else {
                setIsLoading(true);
                throw new Error('Failed to fetch media...')
            }
        })
        .then(data => {
            setMedia(data);
        })
    }, [])
    return (
        <>
            <Helmet>
                <title>Media posts by {currentUser.name}</title>
            </Helmet>
            <div className="mediacon">
                {isLoading ? (
                    <div className='loader'>
                        <span id='loader'></span>
                    </div>
                ):(
                    <>
                    {media && media.length > 0 ? (
                        <>
                        {media.length < 4 ? (
                            <>
                                {media.map(media => (
                                    <div className="mediaimg" style={{backgroundImage: `url(${media.image ? media.image : placeholder})`}} key={media.id}>
                                            
                                    </div>
                                ))}
                                <div className="mediaimg" style={{backgroundImage: `url('')`}}></div>
                                <div className="mediaimg" style={{backgroundImage: `url('')`}}></div>
                                <div className="mediaimg" style={{backgroundImage: `url('')`}}></div>
                                <div className="mediaimg" style={{backgroundImage: `url('')`}}></div>
                            </>
                        ):(
                            <>
                            {media.map(media => (
                                <div className="mediaimg" style={{backgroundImage: `url(${media.image})`}} key={media.id}>
                                        
                                </div>
                            ))}
                            </>
                        )}
                        </>
                    ):(
                        <label style={{width: '100%', textAlign: 'center'}}>No media from this user</label>
                    )}
                        
                    </>
                )}
                

                
            </div>
        </>
        
    )
}