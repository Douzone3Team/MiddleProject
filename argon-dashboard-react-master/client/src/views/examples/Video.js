import React, { useEffect, useRef } from 'react';


const Video = (props) => {
    const ref = useRef();
    const peer = props.peer;

    useEffect(() => {
        peer.on('stream', (stream) => {
            ref.current.srcObject = stream;
        });
        peer.on('track', (track, stream) => {
        });
    }, [peer]);

    return (
        <>
            <div playsInline autoPlay ref={ref}>
            </div>
        </>


    );
};

export default Video;
