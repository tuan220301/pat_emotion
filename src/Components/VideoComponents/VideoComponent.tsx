import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useRecoilState } from 'recoil';
import { editCusState, formState } from '../../Store/formStore';

const VideoComponent = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [emotion, setEmotion] = useState("Không phát hiện biểu cảm");
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [intervalId, setIntervalId] = useState<any>(null);
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const [videoURL, setVideoURL] = useState<string | null>(null);
    const [form, setForm] = useRecoilState(formState);
    const [edit, setEdit] = useRecoilState(editCusState);
    const translateExpressions: { [key: string]: string; } = {
        neutral: 'Bình thường',
        happy: 'Vui vẻ',
        sad: 'Buồn bã',
        angry: 'Tức giận',
        fearful: 'Sợ hãi',
        disgusted: 'Ghê tởm',
        surprised: 'Ngạc nhiên'
    };

    const clearEmotionData = () => {
        setForm({
            id: '',
            cusname: '',
            cusphone: '',
            cusaddress: '',
            video: null,
            emotionData: []
        });
    };
    useEffect(() => {
        console.log('form: ', form);
    }, [form]);
    useEffect(() => {
        if (isCameraOn) {
            clearEmotionData();
        }
    }, [isCameraOn]);
    useEffect(() => {
        if (form.video) {
            const url = URL.createObjectURL(form.video);
            setVideoURL(url);
        }
    }, [form.video]);

    useEffect(() => {
        if (isCameraOn) {
            startVideo();
            loadModels();
        } else {

            stopVideo();
        }

        return () => {
            stopVideo();
        };
    }, [isCameraOn]);

    const startVideo = () => {

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((currentStream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = currentStream;
                    startRecording(currentStream);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (intervalId) {
            clearInterval(intervalId);
        }
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        }
        setEmotion("Không phát hiện biểu cảm");
        stopRecording();
        setEdit(false);

    };

    const loadModels = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            faceapi.nets.faceExpressionNet.loadFromUri("/models")
        ]).then(() => {
            faceMyDetect();
        });
    };

    const faceMyDetect = () => {
        const id = setInterval(async () => {
            if (videoRef.current) {
                const detections: any = await faceapi.detectAllFaces(videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

                if (canvasRef.current) {
                    const displaySize = {
                        width: videoRef.current.videoWidth,
                        height: videoRef.current.videoHeight
                    };
                    faceapi.matchDimensions(canvasRef.current, displaySize);
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);

                    // Clear the canvas
                    const context = canvasRef.current.getContext('2d');
                    if (context) {
                        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    }

                    // Draw detections, landmarks, and expressions
                    faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

                    // Get the highest expression and set the emotion
                    if (detections.length > 0) {
                        const highestExpression = Object.keys(detections[0].expressions).reduce((a, b) =>
                            detections[0].expressions[a] > detections[0].expressions[b] ? a : b
                        );
                        const translatedEmotion = translateExpressions[highestExpression] || highestExpression;
                        const currentTime = videoRef.current.currentTime;
                        setEmotion(translatedEmotion);
                        setForm((prevForm: any) => ({
                            ...prevForm,
                            emotionData: [...prevForm.emotionData, { emotion: translatedEmotion, time: currentTime }]
                        }));

                    } else {
                        setEmotion("Không phát hiện biểu cảm");
                    }

                }
            }

        }, 1000);

        setIntervalId(id);
    };

    const startRecording = (stream: MediaStream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];
        clearEmotionData();
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setForm((prevForm: any) => ({ ...prevForm, video: blob }));
            setVideoURL(url);
        };

        mediaRecorder.start();
        setRecorder(mediaRecorder);
    };

    const stopRecording = () => {
        if (recorder) {
            recorder.stop();

            setRecorder(null);
        }
    };

    return (
        <div className='flex-col items-center justify-center'>
            <div className='flex items-center justify-center relative'>
                <video crossOrigin="anonymous" ref={videoRef} autoPlay muted className='w-full h-[420px]' controls src={videoURL || ''}></video>
                {isCameraOn && <canvas ref={canvasRef} className='absolute w-full h-[420px]' />}
            </div>
            {
                edit === false ? <div className='mb-6 font-bold  flex items-center justify-center'>{emotion}</div> : <></>
            }
            <div className='flex items-center justify-center mb-2 mt-2'>
                <div className={videoURL ? 'flex items-center justify-between w-56' : 'flex items-center justify-center'}>
                    <button
                        className='px-4 py-2 bg-blue-500 text-white rounded'
                        onClick={() => setIsCameraOn(!isCameraOn)}>
                        {isCameraOn ? 'Tắt Camera' : 'Bật Camera'}
                    </button>
                    {videoURL && (
                        <div className='flex items-center'>
                            <a href={videoURL} download="recorded_video.webm" className='px-4 py-2 bg-green-500 text-white rounded'>
                                Tải video
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoComponent;
