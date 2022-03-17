// imports

import React, { createContext, useState, useEfect, useRef  } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";


// socket

const SocketContext = createContext();
const socket = io.connect("http://localhost:3000");


// provider

const SocketProvider = ({ children }) => {

    const [error, setError] = useState('');
    const [stream, setStream] = useState(null);
    const [call, setCall] = useState({});

    const [users, setUsers] = useState(null);
    const [acceptCall, setAcceptCall] = useState(false);

    const userVideo = useRef();
    const user2Video = useRef();
    const connectionRef = useRef();

    useEfect(() => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(currentStream => {
            setStream(currentStream);

            userVideo.current.srcObject = currentStream;
        }).catch(err => {setError(err);})

        socket.on('me', (id) => {
            setUsers(id);
        })

        socket.on('calluser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivedCall: true, from, name: callerName, signal });
        })

    }, [])

    const answerCall = () => {
        setAcceptCall(true);

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });

        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: call.from });
        })

        peer.on('stream', (currentStream) => {
            user2Video.current.srcObject = currentStream;
        })

        peer.signal(call.signal);

        connectionRef.current = peer;

    }

    const callUser = () => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });

        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: call.from });
        })

        peer.on('stream', (currentStream) => {
            user2Video.current.srcObject = currentStream;
        })

    }
}
