//DOM 정의
let localVideo = document.getElementById("localVideo");
let remoteVideo = document.getElementById("remoteVideo");
let isInitiator = false;
let isChannelReady = false;
let isStarted = false;
let localStream;
let remoteStream;
let pc;

//stun 서버 정의
let pcConfig = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
      }]
}

let room = 'foo';

let socket = io.connect();

//소켓 방 만들기, 입장하기, 꽉찼다 등등 방관련 메소드
if(room !==''){
    socket.emit('create or join',room);
    console.log('Attempted to create or join Room',room);
}
socket.on('created', (room,id)=>{
  console.log('Created room' + room+'socket ID : '+id);
  isInitiator= true;
})
socket.on('full', room=>{
  console.log('Room '+room+'is full');
});
socket.on('join',room=>{
  console.log('Another peer made a request to join room' + room);
  console.log('This peer is the initiator of room' + room + '!');
  isChannelReady = true;
})
socket.on('joined',room=>{
  console.log('joined : '+ room );
  isChannelReady= true;
})
socket.on('log', array=>{
  console.log.apply(console,array);
});

//socket 통신 연결
socket.on('message', (message)=>{
    console.log('Client received message :',message);
    if(message === 'got user media'){
      maybeStart();
    }else if(message.type === 'offer'){
      if(!isInitiator && !isStarted){
        maybeStart();
      }
      pc.setRemoteDescription(new RTCSessionDescription(message));
      doAnswer();
    }else if(message.type ==='answer' && isStarted){
      pc.setRemoteDescription(new RTCSessionDescription(message));
    }else if(message.type ==='candidate' &&isStarted){
      const candidate = new RTCIceCandidate({
        sdpMLineIndex : message.label,
        candidate:message.candidate
      });
  
      pc.addIceCandidate(candidate);
    }
})

//시그널링 서버로 소켓정보를 전송하는 메소드
//시그널링서버, 다른 peer로의 데이터 전송 메소드
function sendMessage(message){
    console.log('Client sending message: ',message);
    socket.emit('message',message);
}

//getUserMedia Init
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then(gotStream)
  .catch((error) => console.error(error));

//localStream 을 srcObject에 담아서 발생
function gotStream(stream) {
  console.log("Adding local stream");
  localStream = stream;
  localVideo.srcObject = stream;
  sendMessage("got user media");
  if (isInitiator) {
    maybeStart();
  }
}

//RTCPeerConnection 객체 형성
function createPeerConnection() {
  try {
    pc = new RTCPeerConnection(null);
    pc.onicecandidate = handleIceCandidate;
    //iceCandidate = 데이터 교환을 할 대상의 EndPoint정보
    //iceCandidate 대상이 생긴다면 handleIceCandidate 메소드 실행
    pc.onaddstream = handleRemoteStreamAdded;
    console.log("Created RTCPeerConnection");
  } catch (e) {
    alert("connot create RTCPeerConnection object");
    return;
  }
}

//시그널링 서버로 넘겨줘 상대방 peer가 내 Stream을 연결시켜준다.
function handleIceCandidate(event) {
  console.log("iceCandidateEvent", event);
  if (event.candidate) {
    sendMessage({
      type: "candidate",
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate,
    });
  } else {
    console.log("end of candidates");
  }
}
//에러처리 메소드
function handleCreateOfferError(event) {
  console.log("createOffer() error: ", event);
}

//연결된 Peer를 remoteVideo 뷰에 띄우도록 한다.
function handleRemoteStreamAdded(event) {
  console.log("remote stream added");
  remoteStream = event.stream;
  remoteVideo.srcObject = remoteStream;
}

//자신의 RTCPeerConnection 초기화 후 상대방의 TRCPeerConnection 연결.
function maybeStart() {
    console.log(">>MaybeStart() : ", isStarted, localStream, isChannelReady);
    if (!isStarted && typeof localStream !== "undefined" && isChannelReady) {
      console.log(">>>>> creating peer connection");
      createPeerConnection();
      pc.addStream(localStream);
      isStarted = true;
      console.log("isInitiator : ", isInitiator);
      if (isInitiator) {
        doCall();
      }
    }else{
      console.error('maybeStart not Started!');
    }
}

// doCall & doAnswer을 통해 Description 교환, 서로의 화상 정보가 뷰에 출력.
function doCall() {
  console.log("Sending offer to peer");
  pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}
function doAnswer() {
  console.log("Sending answer to peer");
  pc.createAnswer().then(
    setLocalAndSendMessage,
    onCreateSessionDescriptionError
  );
}

//description 교환
function setLocalAndSendMessage(sessionDescription) {
  pc.setLocalDescription(sessionDescription);
  sendMessage(sessionDescription);
}

function onCreateSessionDescriptionError(error) {
    console.error("Falied to create session Description", error);
}