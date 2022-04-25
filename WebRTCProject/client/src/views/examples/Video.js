import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

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
        <VideoInput playsInline autoPlay ref={ref} />
    );
};
const VideoInput = styled.video``;

export default Video;
