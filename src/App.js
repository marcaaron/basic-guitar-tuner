import React, { Component } from 'react';
import './App.css';
import Wad from 'web-audio-daw';

let tuner;
let frequencyChart = [
	['C0',16.35],
	['C#0', 17.32],
	['D0', 18.35],
	['D#0', 19.45],
	['E0', 20.60],
	['F0', 21.83],
	['F#0', 23.12],
	['G0',	24.50],
	['G#0', 25.96],
	['A0',	27.50],
	['A#0', 29.14],
	['B0',	30.87],
	['C1', 32.70],
	['C#1', 34.65],
	['D1', 36.71],
	['D#1', 38.89],
	['E1', 41.20],
	['F1', 43.65],
	['F#1', 46.25],
	['G1', 49.00],
	['G#1', 51.91],
	['A1', 55.00],
	['A#1', 58.27],
	['B1', 61.74],
	['C2', 65.41],
	['C#2', 69.30],
	['D2', 73.42],
	['D#2', 77.78],
	['E2', 82.41],
	['F2', 87.31],
	['F#2', 92.50],
	['G2', 98.00],
	['G#2', 103.83],
	['A2', 110.00],
	['A#2', 116.54],
	['B2', 123.47],
	['C3', 130.81],
	['C#3', 138.59],
	['D3', 146.83],
	['D#3', 155.56],
	['E3', 164.81],
	['F3', 174.61],
	['F#3', 185.00],
	['G3', 196.00],
	['G#3', 207.65],
	['A3', 220.00],
	['A#3', 233.08],
	['B3', 246.94],
	['C4', 261.63],
	['C#4', 277.18],
	['D4', 293.66],
	['D#4', 311.13],
	['E4', 329.63],
	['F4', 349.23],
	['F#4', 369.99],
	['G4', 392.00],
	['G#4', 415.30],
	['A4', 440.00],
	['A#4', 466.16],
	['B4', 493.88],
	['C5', 523.25],
	['C#5', 554.37],
	['D5', 587.33],
	['D#5', 622.25],
	['E5', 659.25],
	['F5', 698.46],
	['F#5', 739.99],
	['G5', 783.99],
	['G#5', 830.61],
	['A5', 880.00],
	['A#5', 932.33],
	['B5', 987.77],
	['C6', 1046.50],
	['C#6', 1108.73],
	['D6', 1174.66],
	['D#6', 1244.51],
	['E6', 1318.51],
	['F6', 1396.91],
	['F#6', 1479.98],
	['G6', 1567.98],
	['G#6', 1661.22],
	['A6', 1760.00],
	['A#6', 1864.66],
	['B6', 1975.53],
	['C7', 2093.00],
	['C#7', 2217.46],
	['D7', 2349.32],
	['D#7', 2489.02],
	['E7', 2637.02],
	['F7', 2793.83],
	['F#7', 2959.96],
	['G7', 3135.96],
	['G#7', 3322.44],
	['A7', 3520.00],
	['A#7', 3729.31],
	['B7', 3951.07],
	['C8', 4186.01],
	['C#8', 4434.92],
	['D8', 4698.63],
	['D#8', 4978.03],
	['E8', 5274.04],
	['F8', 5587.65],
	['F#8', 5919.91],
	['G8', 6271.93],
	['G#8', 6644.88],
	['A8', 7040.00],
	['A#8', 7458.62],
	['B8',7902.13]
];

class App extends Component {

	constructor(){
		super();
		this.state = {currentPitch:0.0,currentNote:'', correctFrequency:0, index:3};
	}

	componentWillMount(){
		var voice = new Wad({source : 'mic' });
		tuner = new Wad.Poly();
		tuner.add(voice);
		voice.play();
		tuner.updatePitch();
		tuner.output.gain.value = 0;
	}

	componentDidMount(){
		var logPitch = () => {
			let currentPitch = this.state.currentPitch;
			let currentNote = this.state.currentNote;
			if(tuner.pitch){currentPitch = tuner.pitch};
			if(tuner.noteName){currentNote = tuner.noteName};
			this.setState({currentPitch, currentNote});
		    requestAnimationFrame(logPitch);
			this.getCorrectFrequency();
		};
		logPitch();
	}

	getCorrectFrequency = () => {
		let correctFrequency = this.state.correctFrequency;
		let index = this.state.index;
		for(let i=0; i<frequencyChart.length;i++){
			if (frequencyChart[i][0]=== this.state.currentNote){
				correctFrequency = parseInt(frequencyChart[i][1],10);
				index = i;
			}
		}
		this.setState({correctFrequency, index});
	}

  render() {

	  // get range by setting starting frequency to the midpoint in between the previous tonal center and the correct frequency
	  // and the midpoint between the next correct frequency and current correct frequency
	  const previousPitch = frequencyChart[this.state.index-1][1];
	  const nextPitch = frequencyChart[this.state.index+1][1];
	  const bottom = this.state.correctFrequency - ((this.state.correctFrequency-previousPitch)/2);
	  const top = this.state.currentPitch + ((nextPitch-this.state.correctFrequency)/2);
	  const totalRange = top-bottom;
	  const percent = (((top-this.state.currentPitch)*100)/totalRange);
	  const fivepercent = (totalRange/100)*5;
  	  const tenpercent = (totalRange/100)*10;
	  let style = {};
	  if(percent>0 && percent<100){
		if(
			this.state.currentPitch > (this.state.correctFrequency-fivepercent) &&
			this.state.currentPitch < (this.state.correctFrequency+fivepercent)
		){
	  		style = {left:`${percent}%`, background:'white'};
		}else if(
			this.state.currentPitch > (this.state.correctFrequency-tenpercent) &&
			this.state.currentPitch < (this.state.correctFrequency+tenpercent)
		){
			style = {left:`${(percent*90)/100}%`, background:'hsl(248, 1%, 90%)'};
		}
		else{
	  		style = {left:`${(percent*90)/100}%`};
		}
	  }
    return (
      <div className="App">
		  <h1>Basic Guitar Tuner</h1>
		  <div className="info-box">
			  <div className="note">Note: {this.state.currentNote}</div>
	  		  <div className="pitch"> Current Pitch: {this.state.currentPitch} Hz</div>
			  <div className="pitch"> Correct Pitch: {this.state.correctFrequency} Hz</div>

		  </div>

		  <div className="pitch-bar">
			  <div style={style} className="pitch-point"></div>
		  </div>
      </div>
    );
  }
}

export default App;
