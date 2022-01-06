// Copyright Epic Games, Inc. All Rights Reserved.
// universal module definition - read https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["./adapter"], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require("./adapter"));
    } else {
        // Browser globals (root is window)
        root.webRtcPlayer = factory(root.adapter);
    }
}(this, function (adapter) {

    function webRtcPlayer(parOptions) {
    	parOptions = typeof parOptions !== 'undefined' ? parOptions : {};
    	
        var self = this;

        //**********************
        //Config setup
        //**********************
		this.cfg = typeof parOptions.peerConnectionOptions !== 'undefined' ? parOptions.peerConnectionOptions : {};
		this.cfg.sdpSemantics = 'unified-plan';
        // this.cfg.rtcAudioJitterBufferMaxPackets = 10;
        // this.cfg.rtcAudioJitterBufferFastAccelerate = true;
        // this.cfg.rtcAudioJitterBufferMinDelayMs = 0;

		// If this is true in Chrome 89+ SDP is sent that is incompatible with UE Pixel Streaming 4.26 and below.
        // However 4.27 Pixel Streaming does not need this set to false as it supports `offerExtmapAllowMixed`.
        // tdlr; uncomment this line for older versions of Pixel Streaming that need Chrome 89+.
        this.cfg.offerExtmapAllowMixed = false;

        //**********************
        //Variables
        //**********************
        this.pcClient = null;
        this.dcClient = null;
        this.tnClient = null;

        this.sdpConstraints = {
          offerToReceiveAudio: 1, //Note: if you don't need audio you can get improved latency by turning this off.
          offerToReceiveVideo: 1,
          voiceActivityDetection: false
        };

        // See https://www.w3.org/TR/webrtc/#dom-rtcdatachannelinit for values (this is needed for Firefox to be consistent with Chrome.)
        this.dataChannelOptions = {ordered: true};

        // This is useful if the video/audio needs to autoplay (without user input) as browsers do not allow autoplay non-muted of sound sources without user interaction.
        this.startVideoMuted = typeof parOptions.startVideoMuted !== 'undefined' ? parOptions.startVideoMuted : false;
        this.autoPlayAudio = typeof parOptions.autoPlayAudio !== 'undefined' ? parOptions.autoPlayAudio : true;

        // To enable mic in browser use SSL/localhost and have ?useMic in the query string.
        const urlParams = new URLSearchParams(window.location.search);
        this.useMic = urlParams.has('useMic');
        if(!this.useMic)
        {
            console.log("Microphone access is not enabled. Pass ?useMic in the url to enable it.");
        }

        // When ?useMic check for SSL or localhost
        let isLocalhostConnection = location.hostname === "localhost" || location.hostname === "127.0.0.1";
        let isHttpsConnection = location.protocol === 'https:';
        if(this.useMic && !isLocalhostConnection && !isHttpsConnection)
        {
            this.useMic = false;
            console.error("Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access.");
            console.error("For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'");
        }

        // Latency tester
        this.latencyTestTimings = 
        {
            TestStartTimeMs: null,
            UEReceiptTimeMs: null,
            UEPreCaptureTimeMs: null,
            UEPostCaptureTimeMs: null,
            UEPreEncodeTimeMs: null,
            UEPostEncodeTimeMs: null,
            UETransmissionTimeMs: null,
            BrowserReceiptTimeMs: null,
            FrameDisplayDeltaTimeMs: null,
            Reset: function()
            {
                this.TestStartTimeMs = null;
                this.UEReceiptTimeMs = null;
                this.UEPreCaptureTimeMs = null;
                this.UEPostCaptureTimeMs = null;
                this.UEPreEncodeTimeMs = null;
                this.UEPostEncodeTimeMs = null;
                this.UETransmissionTimeMs = null;
                this.BrowserReceiptTimeMs = null;
                this.FrameDisplayDeltaTimeMs = null;
            },
            SetUETimings: function(UETimings)
            {
                this.UEReceiptTimeMs = UETimings.ReceiptTimeMs;
                this.UEPreCaptureTimeMs = UETimings.PreCaptureTimeMs;
                this.UEPostCaptureTimeMs = UETimings.PostCaptureTimeMs;
                this.UEPreEncodeTimeMs = UETimings.PreEncodeTimeMs;
                this.UEPostEncodeTimeMs = UETimings.PostEncodeTimeMs;
                this.UETransmissionTimeMs = UETimings.TransmissionTimeMs;
                this.BrowserReceiptTimeMs = Date.now();
                this.OnAllLatencyTimingsReady(this);
            },
            SetFrameDisplayDeltaTime: function(DeltaTimeMs)
            {
                if(this.FrameDisplayDeltaTimeMs == null)
                {
                    this.FrameDisplayDeltaTimeMs = Math.round(DeltaTimeMs);
                    this.OnAllLatencyTimingsReady(this);
                }
            },
            OnAllLatencyTimingsReady: function(Timings){}
        }

        //**********************
        //Functions
        //**********************

        //Create Video element and expose that as a parameter
        this.createWebRtcVideo = function() {
            var video = document.createElement('video');

            video.id = "streamingVideo";
            video.playsInline = true;
            video.disablepictureinpicture = true;
            video.muted = self.startVideoMuted;;
			
            video.addEventListener('loadedmetadata', function(e){
                if(self.onVideoInitialised){
                    self.onVideoInitialised();
                }
            }, true);
			
			// Check if request video frame callback is supported
			if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
				// The API is supported! 
				
				const onVideoFrameReady = (now, metadata) => {
					
					if(metadata.receiveTime && metadata.expectedDisplayTime)
					{
						const receiveToCompositeMs = metadata.presentationTime - metadata.receiveTime;
						self.aggregatedStats.receiveToCompositeMs = receiveToCompositeMs;
					}
					
				  
					// Re-register the callback to be notified about the next frame.
					video.requestVideoFrameCallback(onVideoFrameReady);
				};
				
				// Initially register the callback to be notified about the first frame.
				video.requestVideoFrameCallback(onVideoFrameReady);
			}
			
            return video;
        }

        this.video = this.createWebRtcVideo();

        onsignalingstatechange = function(state) {
            console.info('signaling state change:', state)
        };

        oniceconnectionstatechange = function(state) {
            console.info('ice connection state change:', state)
        };

        onicegatheringstatechange = function(state) {
            console.info('ice gathering state change:', state)
        };

        handleOnTrack = function(e) {
            console.log('handleOnTrack', e.streams);
			
			if (e.track)
			{
				console.log('Got track - ' + e.track.kind + ' id=' + e.track.id + ' readyState=' + e.track.readyState); 
			}
			
			if(e.track.kind == "audio")
			{
                handleOnAudioTrack(e.streams[0]);
                return;
			}
            else(e.track.kind == "video" && self.video.srcObject !== e.streams[0])
            {
                self.video.srcObject = e.streams[0];
				console.log('Set video source from video track ontrack.');
                return;
            }
			
        };

        handleOnAudioTrack = function(audioMediaStream)
        {
            // do nothing the video has the same media stream as the audio track we have here (they are linked)
            if(self.video.srcObject == audioMediaStream)
            {
                return;
            }
            // video element has some other media stream that is not associated with this audio track
            else if(self.video.srcObject && self.video.srcObject !== audioMediaStream)
            {
                // create a new audio element
                let audioElem = document.createElement("Audio");
                audioElem.srcObject = audioMediaStream;

                // there is no way to autoplay audio (even muted), so we defer audio until first click
                if(!self.autoPlayAudio) {

                    let clickToPlayAudio = function() {
                        audioElem.play();
                        self.video.removeEventListener("click", clickToPlayAudio);
                    };

                    self.video.addEventListener("click", clickToPlayAudio);
                }
                // we assume the user has clicked somewhere on the page and autoplaying audio will work
                else {
                    audioElem.play();
                }
                console.log('Created new audio element to play seperate audio stream.');
            }

        }

        setupDataChannel = function(pc, label, options) {
            try {
                let datachannel = pc.createDataChannel(label, options);
                console.log(`Created datachannel (${label})`)

                // Inform browser we would like binary data as an ArrayBuffer (FF chooses Blob by default!)
                datachannel.binaryType = "arraybuffer";
                
                datachannel.onopen = function (e) {
                  console.log(`data channel (${label}) connect`)
                  if(self.onDataChannelConnected){
                    self.onDataChannelConnected();
                  }
                }

                datachannel.onclose = function (e) {
                  console.log(`data channel (${label}) closed`)
                }

                datachannel.onmessage = function (e) {
                  //console.log(`Got message (${label})`, e.data)
                  if (self.onDataChannelMessage)
                    self.onDataChannelMessage(e.data);
                }

                return datachannel;
            } catch (e) { 
                console.warn('No data channel', e);
                return null;
            }
        }

        onicecandidate = function (e) {
			console.log('ICE candidate', e)
			if (e.candidate && e.candidate.candidate) {
                self.onWebRtcCandidate(e.candidate);
            }
        };

        handleCreateOffer = function (pc) {
            pc.createOffer(self.sdpConstraints).then(function (offer) {
                
                // Munging is where we modifying the sdp string to set parameters that are not exposed to the browser's WebRTC API
                mungeSDPOffer(offer);

                // Set our munged SDP on the local peer connection so it is "set" and will be send across
            	pc.setLocalDescription(offer);
            	if (self.onWebRtcOffer) {
            		self.onWebRtcOffer(offer);
                }
            },
            function () { console.warn("Couldn't create offer") });
        }

        mungeSDPOffer = function (offer) {

            // turn off video-timing sdp sent from browser
            //offer.sdp = offer.sdp.replace("http://www.webrtc.org/experiments/rtp-hdrext/playout-delay", "");

            // this indicate we support stereo (Chrome needs this)
            offer.sdp = offer.sdp.replace('useinbandfec=1', 'useinbandfec=1;stereo=1;sprop-maxcapturerate=48000');

        }
        
        setupPeerConnection = function (pc) {
        	if (pc.SetBitrate)
        		console.log("Hurray! there's RTCPeerConnection.SetBitrate function");

            //Setup peerConnection events
            pc.onsignalingstatechange = onsignalingstatechange;
            pc.oniceconnectionstatechange = oniceconnectionstatechange;
            pc.onicegatheringstatechange = onicegatheringstatechange;

            pc.ontrack = handleOnTrack;
            pc.onicecandidate = onicecandidate;
        };

        generateAggregatedStatsFunction = function(){
            if(!self.aggregatedStats)
                self.aggregatedStats = {};

            return function(stats){
                //console.log('Printing Stats');

                let newStat = {};
                
                stats.forEach(stat => {
//                    console.log(JSON.stringify(stat, undefined, 4));
                    if (stat.type == 'inbound-rtp' 
                        && !stat.isRemote 
                        && (stat.mediaType == 'video' || stat.id.toLowerCase().includes('video'))) {

                        newStat.timestamp = stat.timestamp;
                        newStat.bytesReceived = stat.bytesReceived;
                        newStat.framesDecoded = stat.framesDecoded;
                        newStat.packetsLost = stat.packetsLost;
                        newStat.bytesReceivedStart = self.aggregatedStats && self.aggregatedStats.bytesReceivedStart ? self.aggregatedStats.bytesReceivedStart : stat.bytesReceived;
                        newStat.framesDecodedStart = self.aggregatedStats && self.aggregatedStats.framesDecodedStart ? self.aggregatedStats.framesDecodedStart : stat.framesDecoded;
                        newStat.timestampStart = self.aggregatedStats && self.aggregatedStats.timestampStart ? self.aggregatedStats.timestampStart : stat.timestamp;

                        if(self.aggregatedStats && self.aggregatedStats.timestamp){
                            if(self.aggregatedStats.bytesReceived){
                                // bitrate = bits received since last time / number of ms since last time
                                //This is automatically in kbits (where k=1000) since time is in ms and stat we want is in seconds (so a '* 1000' then a '/ 1000' would negate each other)
                                newStat.bitrate = 8 * (newStat.bytesReceived - self.aggregatedStats.bytesReceived) / (newStat.timestamp - self.aggregatedStats.timestamp);
                                newStat.bitrate = Math.floor(newStat.bitrate);
                                newStat.lowBitrate = self.aggregatedStats.lowBitrate && self.aggregatedStats.lowBitrate < newStat.bitrate ? self.aggregatedStats.lowBitrate : newStat.bitrate
                                newStat.highBitrate = self.aggregatedStats.highBitrate && self.aggregatedStats.highBitrate > newStat.bitrate ? self.aggregatedStats.highBitrate : newStat.bitrate
                            }

                            if(self.aggregatedStats.bytesReceivedStart){
                                newStat.avgBitrate = 8 * (newStat.bytesReceived - self.aggregatedStats.bytesReceivedStart) / (newStat.timestamp - self.aggregatedStats.timestampStart);
                                newStat.avgBitrate = Math.floor(newStat.avgBitrate);
                            }

                            if(self.aggregatedStats.framesDecoded){
                                // framerate = frames decoded since last time / number of seconds since last time
                                newStat.framerate = (newStat.framesDecoded - self.aggregatedStats.framesDecoded) / ((newStat.timestamp - self.aggregatedStats.timestamp) / 1000);
                                newStat.framerate = Math.floor(newStat.framerate);
                                newStat.lowFramerate = self.aggregatedStats.lowFramerate && self.aggregatedStats.lowFramerate < newStat.framerate ? self.aggregatedStats.lowFramerate : newStat.framerate
                                newStat.highFramerate = self.aggregatedStats.highFramerate && self.aggregatedStats.highFramerate > newStat.framerate ? self.aggregatedStats.highFramerate : newStat.framerate
                            }

                            if(self.aggregatedStats.framesDecodedStart){
                                newStat.avgframerate = (newStat.framesDecoded - self.aggregatedStats.framesDecodedStart) / ((newStat.timestamp - self.aggregatedStats.timestampStart) / 1000);
                                newStat.avgframerate = Math.floor(newStat.avgframerate);
                            }
                        }
                    }

                    //Read video track stats
                    if(stat.type == 'track' && (stat.trackIdentifier == 'video_label' || stat.kind == 'video')) {
                        newStat.framesDropped = stat.framesDropped;
                        newStat.framesReceived = stat.framesReceived;
                        newStat.framesDroppedPercentage = stat.framesDropped / stat.framesReceived * 100;
                        newStat.frameHeight = stat.frameHeight;
                        newStat.frameWidth = stat.frameWidth;
                        newStat.frameHeightStart = self.aggregatedStats && self.aggregatedStats.frameHeightStart ? self.aggregatedStats.frameHeightStart : stat.frameHeight;
                        newStat.frameWidthStart = self.aggregatedStats && self.aggregatedStats.frameWidthStart ? self.aggregatedStats.frameWidthStart : stat.frameWidth;
                    }

                    if(stat.type =='candidate-pair' && stat.hasOwnProperty('currentRoundTripTime') && stat.currentRoundTripTime != 0){
                        newStat.currentRoundTripTime = stat.currentRoundTripTime;
                    }
                });

				
				if(self.aggregatedStats.receiveToCompositeMs)
				{
					newStat.receiveToCompositeMs = self.aggregatedStats.receiveToCompositeMs;
                    self.latencyTestTimings.SetFrameDisplayDeltaTime(self.aggregatedStats.receiveToCompositeMs);
				}
				
                self.aggregatedStats = newStat;

                if(self.onAggregatedStats)
                    self.onAggregatedStats(newStat)
            }
        };

        setupTracksToSendAsync = async function(pc){
            
            // Setup a transceiver for getting UE video
            pc.addTransceiver("video", { direction: "recvonly" });

            // Setup a transceiver for sending mic audio to UE and receiving audio from UE
            if(!self.useMic)
            {
                pc.addTransceiver("audio", { direction: "recvonly" });
            }
            else
            {
                let audioSendOptions = self.useMic ? 
                {
                    autoGainControl: false,
                    channelCount: 1,
                    echoCancellation: false,
                    latency: 0,
                    noiseSuppression: false,
                    sampleRate: 16000,
                    volume: 1.0
                } : false;

                // Note using mic on android chrome requires SSL or chrome://flags/ "unsafely-treat-insecure-origin-as-secure"
                const stream = await navigator.mediaDevices.getUserMedia({video: false, audio: audioSendOptions});
                if(stream)
                {
                    for (const track of stream.getTracks()) {
                        if(track.kind && track.kind == "audio")
                        {
                            pc.addTransceiver(track, { direction: "sendrecv" });
                        }
                    }
                }
                else
                {
                    pc.addTransceiver("audio", { direction: "recvonly" });
                }
            }
        };


        //**********************
        //Public functions
        //**********************

        this.setVideoEnabled = function(enabled) {
            self.video.srcObject.getTracks().forEach(track => track.enabled = enabled);
        }

        this.startLatencyTest = function(onTestStarted) {
            // Can't start latency test without a video element
            if(!self.video)
            {
                return;
            }

            self.latencyTestTimings.Reset();
            self.latencyTestTimings.TestStartTimeMs = Date.now();
            onTestStarted(self.latencyTestTimings.TestStartTimeMs);            
        }

        //This is called when revceiving new ice candidates individually instead of part of the offer
        //This is currently not used but would be called externally from this class
        this.handleCandidateFromServer = function(iceCandidate) {
            console.log("ICE candidate: ", iceCandidate);
            let candidate = new RTCIceCandidate(iceCandidate);
            self.pcClient.addIceCandidate(candidate).then(_=>{
                console.log('ICE candidate successfully added');
            });
        };

        //Called externaly to create an offer for the server
        this.createOffer = function() {
            if(self.pcClient){
                console.log("Closing existing PeerConnection")
                self.pcClient.close();
                self.pcClient = null;
            }
            self.pcClient = new RTCPeerConnection(self.cfg);

            setupTracksToSendAsync(self.pcClient).finally(function()
            {
                setupPeerConnection(self.pcClient);
                self.dcClient = setupDataChannel(self.pcClient, 'cirrus', self.dataChannelOptions);
                handleCreateOffer(self.pcClient);
            });
            
        };

        //Called externaly when an answer is received from the server
        this.receiveAnswer = function(answer) {
            console.log('Received answer:');
            console.log(answer);
            var answerDesc = new RTCSessionDescription(answer);
            self.pcClient.setRemoteDescription(answerDesc);

            let receivers = self.pcClient.getReceivers();
            for(let receiver of receivers)
            {
                receiver.playoutDelayHint = 0;
            }
        };

        this.close = function(){
            if(self.pcClient){
                console.log("Closing existing peerClient")
                self.pcClient.close();
                self.pcClient = null;
            }
            if(self.aggregateStatsIntervalId)
                clearInterval(self.aggregateStatsIntervalId);
        }

        //Sends data across the datachannel
        this.send = function(data){
            if(self.dcClient && self.dcClient.readyState == 'open'){
                //console.log('Sending data on dataconnection', self.dcClient)
                self.dcClient.send(data);
            }
        };

        this.getStats = function(onStats){
            if(self.pcClient && onStats){
                self.pcClient.getStats(null).then((stats) => { 
                    onStats(stats); 
                });
            }
        }

        this.aggregateStats = function(checkInterval){
            let calcAggregatedStats = generateAggregatedStatsFunction();
            let printAggregatedStats = () => { self.getStats(calcAggregatedStats); }
            self.aggregateStatsIntervalId = setInterval(printAggregatedStats, checkInterval);
        }
    };

    return webRtcPlayer;
  
}));
