const startButton = document.getElementById('button1')
const stopButton = document.getElementById('button2')
const logButton = document.getElementById('button3')


const audioCtx = new AudioContext();

startButton.addEventListener('click', () => {
  
  // check if context is in suspended state (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  scheduler()
  scheduler2()
})

stopButton.addEventListener('click', () => {
  window.clearTimeout(timerID)
  window.clearTimeout(timerID2)
})

logButton.addEventListener('click', () => {
console.log("audioCtx.currentTime: ",audioCtx.currentTime);
})

//* taken from: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques#playing_the_audio_in_time

let tempo1 = 140
let tempo2 = 320

const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)


let currentNote1 = 0;
let currentNote2 = 0;

let nextNoteTime1 = 0.0; // when the next note is due.
let nextNoteTime2 = 0.0; // when the next note is due.

function nextNote1() {
    const secondsPerBeat = 60.0 / tempo1;

    nextNoteTime1 += secondsPerBeat; // Add beat length to last beat time

    // Advance the beat number, wrap to zero
    //* NOTE - we are not using current note here
    currentNote1++;
    if (currentNote1 === 4) {
            currentNote1 = 0;
    }
}
function nextNote2() {
    const secondsPerBeat = 60.0 / tempo2;

    nextNoteTime2 += secondsPerBeat; // Add beat length to last beat time

    // Advance the beat number, wrap to zero
    currentNote2++;
    if (currentNote2 === 4) {
            currentNote2 = 0;
    }
}


const notesInQueue = [];

let counter = 0
let barLength = 8

function scheduleNote1(beatNumber, time) {
  // push the note on the queue, even if we're not playing.
  //* ONLY USED FOR DRAW FUNCTION IN TUTORIAL
  notesInQueue.push({ note: beatNumber, time: time });

  // playOscTone(220)
  
  //* this switch statement, along with the above counter, creates a crude sequencer loop 
  // switch (counter % barLength) {
  //   case 0:
  //     playOscTone(170)
  //     break;
  //   case 3:
  //     playOscTone(170)
  //     break;
  //   case 6:
  //     playOscTone(450)
  //     break;
  //   default:
  //     break;
  // }

  counter ++;
}


let counter2 = 0
let barLength2 = 8


function scheduleNote2(beatNumber, time) {
  // push the note on the queue, even if we're not playing.
  //* ONLY USED FOR DRAW FUNCTION IN TUTORIAL
  notesInQueue.push({ note: beatNumber, time: time });

  // sounds[0].play()
  
  // playOscTone(520)
  
  switch (counter2 % barLength2) {
    case 0:
      sounds[0].play()
      // playOscTone(220)
      break;
      case 3:
      //* adding random play choices
      Math.random() >0.5 ? sounds[0].play() : playOscTone(120)
      // playOscTone(220)
      break;
    case 6:
      Math.random() >0.5 ? sounds[3].play() : sounds[4].play() 
      // playOscTone(520)
      break;
    default:
      break;
  }

  counter2 ++;
}

/*
AudioContext object instances have a currentTime property, which allows us to retrieve the number of seconds after we first created the context. This is what we shall use for timing within our step sequencer — It's extremely accurate, returning a float value accurate to about 15 decimal places.
*/

function scheduler() {
  // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
  while (nextNoteTime1 < audioCtx.currentTime + scheduleAheadTime ) {
      scheduleNote1(currentNote1, nextNoteTime1);
      nextNote1();
  }
  timerID = window.setTimeout(scheduler, lookahead);
}

//experiment with multiple time streams
function scheduler2() {
  // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
  while (nextNoteTime2 < audioCtx.currentTime + scheduleAheadTime ) {
      scheduleNote2(currentNote2, nextNoteTime2);
      nextNote2();
  }
  timerID2 = window.setTimeout(scheduler2, lookahead);
}


// to play our sound
function playOscTone(freq) {
  let osc = audioCtx.createOscillator()
  osc.connect(audioCtx.destination)
  osc.type = 'sine';
  // console.log("in playOscTone");
  // console.log("freq: ",freq);
  // console.log("audioCtx.currentTime: ",audioCtx.currentTime);
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
  osc.start()
  setTimeout(() => osc.stop(), 50)
}

const soundNumbers = [4,6,9,12,15]

const sounds = soundNumbers.map(number => {
  let sound = new Audio();
  sound.src = `sounds/sound_${number}.WAV`
  return sound
})