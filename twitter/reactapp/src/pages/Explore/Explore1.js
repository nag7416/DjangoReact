import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"

export default function Explore1(){
    const [trends , setTrend] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
            <div className="trends">
                {isLoading ? (
                    <div className='loader'>
                        <span id='loader'></span>
                    </div>
                ):(
                    <>
                        {trends.map(trend => (
                            <NavLink to={`/trend/${trend.name}`} key={trend.id}>
                                <div className="link">
                                    <label>#{trend.name}</label>
                                    <span>{trend.post_count} posts</span>
                                </div>
                            </NavLink>
                        ))}
                    </>
                )}
            </div>
        </>
    )
}