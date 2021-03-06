import React,{useEffect,useState,useRef} from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";


const User=()=>{



    const [yourID,setYourID]=useState("");
    const [users, setUsers]=useState({});
    const [stream,setStream]=useState();
    const [receivingCall,setReceivingCall]=useState(false);
    const [caller,setCaller]=useState("");
    const [callerSignal,setCallerSignal]=useState();
    const [callAccepted,setCallAccepted]=useState(false);


     const userVideo=useRef();
     const partnerVideo=useRef();
     const socket= useRef();

     useEffect(()=>{
         socket.current=io.connect("http://localhost:4000")
         console.log(socket.current)
         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
         .then(stream => 
         {
             setStream(stream);
             if (userVideo.current) {
                 userVideo.current.srcObject = stream;
             }

         })


         socket.current.on("yourID",(id)=>{
             setYourID(id);
         })

         socket.current.on("allUsers",(users=>{
             setUsers(users);
         }))

         socket.current.on("hey",(data)=>{
             setReceivingCall(true);
             setCaller(data.from);
             setCallerSignal(data.signal);
         })
        }, []);


         function callPeer(id) {
                const peer = new Peer({
                  initiator: true,
                  trickle: false,
                  config: {
            
                    iceServers: [
                        {
                            urls: "stun:numb.viagenie.ca",
                            username: "sultan1640@gmail.com",
                            credential: "98376683"
                        },
                        {
                            urls: "turn:numb.viagenie.ca",
                            username: "sultan1640@gmail.com",
                            credential: "98376683"
                        }
                    ]
                },
                  stream: stream,
                });

                peer.on("signal",data=>{
                    socket.current.emit("callUser",{userToCall:id, signalData:data,from:yourID})

                })

                peer.on("stream",stream=>{
                    if (partnerVideo.current){
                        partnerVideo.current.srcObject= stream;
                    }
                })

                socket.current.on("CallAccepted",signal=>{
                    setCallAccepted(true);
                    peer.signal(signal);
                })
         }



         function acceptCall(){
             setCallAccepted(true);
             const peer=new Peer({
                 initiator:false,
                 trickle:false,
                 stream:stream,
            })

            peer.on("signal",data=>{
                socket.current.emit("acceptCall",{sginal:data,to:caller})
            })
            peer.on("stream",stream=>{
                partnerVideo.current.srcObject=stream;
            })
            peer.signal(callerSignal)
         }


         let UserVideo;
         if (stream){
             UserVideo=(
                 <video playsInline muted ref={userVideo} autoPlay style={{height:"100%",width:"100%"}}/>
             )
         }

         let PartnerVideo;
         if(callAccepted){
             PartnerVideo=(
                 <video playsInline ref={partnerVideo} autoPlay style={{height:"100%",width:"100%"}}/>
             )
         }
         
         let incomingCall;

         if (receivingCall){
             incomingCall=(
                 <div>
                    <h1>{caller} is Calling you</h1>
                    <button onclick={acceptCall}>Accept</button>
                 </div>
             )
         }


         return(
             <div>
                <div className="row">
                    <div className="col video s2" style={{height:"22.2vh",padding:"0"}}>{UserVideo}</div>
                    <div className="col video s2 offset-s8" style={{height:"22.2vh",padding:"0"}}>{PartnerVideo}</div>
                </div>
                <div className="row">
                    {Object.keys(users).map(key=>{
                        if (key===yourID){
                            return null;
                        }
                        return(
                            <button onClick={()=> callPeer(key)}>Call {key}</button>
                        )
                    })}
                </div>
                <div>
                {incomingCall}
                </div>
             </div>
         )
    
}


export default User