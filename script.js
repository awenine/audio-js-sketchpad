const button1 = document.getElementById('button1')
const button2 = document.getElementById('button2')

const audioCtx = new AudioContext();
console.log("audioCtx: ",audioCtx);

const soundNumbers = [4,6,9,12,15]

const sounds = soundNumbers.map(number => {
  let sound = new Audio();
  sound.src = `sounds/sound_${number}.WAV`
  return sound
})

let audioSource;
let analyser;

// let audio1 = new Audio()
// audio1.src = 'sounds/sound_4.WAV';
//* can be simplified by passing src as first argument of Audio obj

let isPlaying = false

button1.addEventListener('click', () => {
    playRandomSound()
})

button2.addEventListener('click', () => {
  console.log("audioCtx.currentTime: ",audioCtx.currentTime);
})

const colours = ['orange','green','antiquewhite','peru','black']

sounds.forEach((sound,index) => {
  setColourChangeListener(sound,colours[index])
})

function setColourChangeListener(sound, colour) {
  sound.addEventListener('playing',() => {
  changeBackgroundColour(colour)
  })
  sound.addEventListener('ended',() => {
  changeBackgroundColour('gray')
  })
}


//* plays random sound from collection
function playRandomSound() {
  const randomSound = sounds[Math.floor(Math.random()*sounds.length)]
  randomSound.play()
  audioSource = audioCtx.createMediaElementSource(randomSound);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength)
  console.log("dataArray: ",dataArray);
}

function animate() {
  let freqDataArray = analyser.getByteFrequencyData(dataArray)
  console.log("freqDataArray: ",freqDataArray);
  requestAnimationFrame(animate)
}

// animate()

//* changes colour of body background
function changeBackgroundColour(colour) {
  document.body.style.background = colour
}


//- check click height output (log)
//- use it to set and play oscillator tone

document.body.addEventListener('click', (e) => {
 console.log(e.clientY); 
 playOscTone(e.clientY)
 setTimeout(() =>  
 playOscTone(e.clientY*1.9), 250)
 setTimeout(() =>  
 playOscTone(e.clientY*2.4), 500)
})

function playOscTone(freq) {
  let osc = audioCtx.createOscillator()
  osc.connect(audioCtx.destination)
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
  osc.start()
  setTimeout(() => osc.stop(), 250)
}