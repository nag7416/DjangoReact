import Left from "../components/Left";
import Right from "../components/Right";

export default function ProfileSetting({ userdata }){
    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
        zIndex: 2, // Adjust the z-index to overlay on top of the background
    };
    return (
        <>
            <div style={overlayStyle}>Profile Setting</div>
        </>
    )
}