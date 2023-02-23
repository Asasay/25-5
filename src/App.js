import "./App.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faRotateRight,
  faArrowDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [status, setStatus] = useState("session pause");
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timer, setTimer] = useState({ minutes: 25, seconds: 0 });
  return (
    <div className="App">
      <div id="container">
        <p>25 + 5 Clock</p>
        <Break
          breakLength={breakLength}
          setBreakLength={setBreakLength}
          status={status}
        />
        <Session
          sessionLength={sessionLength}
          setSessionLength={setSessionLength}
          setTimer={setTimer}
          status={status}
        />
        <Timer timer={timer} status={status} />
        <Controls
          setBreakLength={setBreakLength}
          breakLength={breakLength}
          setSessionLength={setSessionLength}
          sessionLength={sessionLength}
          timer={timer}
          setTimer={setTimer}
          status={status}
          setStatus={setStatus}
        />
      </div>
    </div>
  );
}

function Break(props) {
  let handleClick = (e) => {
    if (props.status === "session" || props.status === "break") return;
    let targetID = e.currentTarget.id;
    if (targetID === "break-increment" && props.breakLength < 60)
      props.setBreakLength(props.breakLength + 1);
    if (targetID === "break-decrement" && props.breakLength > 1)
      props.setBreakLength(props.breakLength - 1);
  };
  return (
    <div id="break">
      <label for="break-length" id="break-label">
        Break Length
      </label>
      <button id="break-increment" onClick={handleClick}>
        <FontAwesomeIcon icon={faArrowUp} size={"2x"} />
      </button>
      <p id="break-length">{props.breakLength}</p>
      <button id="break-decrement" onClick={handleClick}>
        <FontAwesomeIcon icon={faArrowDown} size={"2x"} />
      </button>
    </div>
  );
}

function Session(props) {
  let handleClick = (e) => {
    if (props.status === "session" || props.status === "break") return;
    let targetID = e.currentTarget.id;
    if (targetID === "session-increment" && props.sessionLength < 60) {
      props.setTimer({ minutes: props.sessionLength + 1, seconds: 0 });
      props.setSessionLength(props.sessionLength + 1);
    }
    if (targetID === "session-decrement" && props.sessionLength > 1) {
      props.setTimer({ minutes: props.sessionLength - 1, seconds: 0 });
      props.setSessionLength(props.sessionLength - 1);
    }
  };
  return (
    <div id="session">
      <label for="session-length" id="session-label">
        Session Length
      </label>
      <button id="session-increment" onClick={handleClick}>
        <FontAwesomeIcon icon={faArrowUp} size={"2x"} />
      </button>
      <p id="session-length">{props.sessionLength}</p>
      <button id="session-decrement" onClick={handleClick}>
        <FontAwesomeIcon icon={faArrowDown} size={"2x"} />
      </button>
    </div>
  );
}

function Timer(props) {
  return (
    <div id="timer">
      <label for="time-left" id="timer-label">
        {props.status.split(' ')[0]}
      </label>
      <p id="time-left">
        {props.timer.minutes.toString().length === 1 ? "0" + props.timer.minutes : props.timer.minutes}:{props.timer.seconds.toString().length === 1 ? "0" + props.timer.seconds : props.timer.seconds}
      </p>
    </div>
  );
}
//sesp->ses->brp->br->sesp
function Controls(props) {
  const [futureDate, setFutureDate] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(futureDate - new Date().getTime());
    }, 500);

    return () => clearInterval(interval);
  }, [futureDate]);

  function startStop() {
    if (props.status==="session pause") {
      props.setStatus('session');
      setFutureDate(new Date(Date.now() + props.timer.minutes * 60000 + props.timer.seconds * 1000));
    }
    else if (props.status==="break pause") {
      props.setStatus('break');
      setFutureDate(new Date(Date.now() + props.timer.minutes * 60000 + props.timer.seconds * 1000));}
    else {
      props.setStatus(props.status+" pause");
      setFutureDate(0);
    }
  }
  function setCountDown (interval) {
    let intervalInSeconds = interval/1000;
    let beep = document.getElementById("beep");

    if (intervalInSeconds <= 0) {
      if (props.status === "session") {
        props.setStatus("break");
        props.setTimer({minutes: props.breakLength, seconds: 0});
        setFutureDate(new Date(Date.now() + props.breakLength * 60000));
        beep.play();
      }
      else if (props.status === "break") {
        props.setStatus("session");
        props.setTimer({minutes: props.sessionLength, seconds: 0});
        setFutureDate(new Date(Date.now() + props.sessionLength * 60000));
        beep.play();
      }
    } 
    else {
      props.setTimer({minutes: Math.floor(intervalInSeconds/60), seconds: Math.floor(intervalInSeconds%60)});
    } 
  }
  function reset() {
    setFutureDate(0);
    props.setStatus("session pause");
    props.setSessionLength(25);
    props.setBreakLength(5);
    props.setTimer({minutes: 25, seconds: 0});
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  }
  return (
    <div id="controls">
      <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
      <button id="start_stop" onClick={startStop} >
        <FontAwesomeIcon icon={faPlay} size={"2x"} />
        <FontAwesomeIcon icon={faPause} size={"2x"} />
      </button>
      <button id="reset" onClick={reset}>
        <FontAwesomeIcon icon={faRotateRight} size={"2x"} />
      </button>
    </div>
  );
}
export default App;
