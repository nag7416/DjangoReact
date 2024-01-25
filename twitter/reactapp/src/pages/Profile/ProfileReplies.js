import { Helmet } from "react-helmet";

export default function ProfileReplies({ currentUser }){
    return (
        <>
            <Helmet>
                <title>Posts with replies by {currentUser.name}</title>
            </Helmet>
            Profile Replies Page
        </>
    )
}