import React, { useCallback, useEffect, useRef, useState } from "react";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ width = "100%", height = "100%", url }) => {
  console.log(url);
  //TODO optimization
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  function handlePlayAndPause() {
    setPlaying(!playing);
  }

  function handleProgress(state) {
    if (!seeking) {
      setPlayed(state.played);
    }
  }

  function handleRewind() {
    const internalPlayer = playerRef.current?.getInternalPlayer?.();
    const current =
      typeof internalPlayer?.getCurrentTime === "function"
        ? internalPlayer.getCurrentTime()
        : 0;
    internalPlayer?.seekTo?.(Math.max(0, current - 10));
  }

  function handleForward() {
    const internalPlayer = playerRef.current?.getInternalPlayer?.();
    const current =
      typeof internalPlayer?.getCurrentTime === "function"
        ? internalPlayer.getCurrentTime()
        : 0;
    internalPlayer?.seekTo?.(current + 10);
  }

  function handleToggleMute() {
    setMuted(!muted);
  }

  function handleSeekChange(newValue) {
    setPlayed(newValue);
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  }

  function handleVolumeChange(newValue) {
    setVolume(newValue[0]);
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }

    return `${mm}:${ss}`;
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  function handleMouseMove() {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);
  const internalPlayer = playerRef.current?.getInternalPlayer?.();
  console.log(url);
  return (
    <div className="w-[500px] h-[200px]">
      <video src={url} autoPlay={true} controls={true} />
    {/* <div
      ref={playerContainerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out ${
        isFullScreen ? "w-screen h-screen" : ""
      }`}
      style={{
        width,
        height,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      { url &&
      <ReactPlayer
        ref={playerRef}
        className="absolute top-0 left-0"
        width={"100%"}
        height={"100%"}
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
      />}
      {false && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4 transition-opacity duration -300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[played * 1000]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className={"w-full mb-4"}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAndPause}
                className="bg-white text-gray-700  hover:opacity-70"
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                onClick={handleRewind}
                variant="ghost"
                size={"icon"}
                className="bg-white text-gray-700  hover:opacity-70"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
              <Button
                onClick={handleForward}
                variant="ghost"
                size={"icon"}
                className="bg-white text-gray-700  hover:opacity-70"
              >
                <RotateCw className="w-6 h-6" />
              </Button>
              <Button
                onClick={handleToggleMute}
                variant="ghost"
                size={"icon"}
                className="bg-white text-gray-700  hover:opacity-70"
              >
                {muted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </Button>
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange(value[0] / 100)}
                className={"w-24"}
              />
            </div>
            <div className="flex items-center soace-x-2">
              <div className="text-white ">
              {formatTime(played * (internalPlayer?.current?.getDuration() || 0))}{" "}
                / {formatTime(internalPlayer?.current?.getDuration() || 0)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
                className="bg-white text-gray-700 hover:opacity-70"
              >
                {isFullScreen ? (
                  <Minimize className="w-6 h-6" />
                ) : (
                  <Maximize className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div> */}
    </div>
  );
};

export default VideoPlayer;
