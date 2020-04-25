import p5 from 'p5'
import Tone from 'tone'

const sketch = p => {

  let synth = new Tone.Synth().toMaster()
  var part = new Tone.Part(
    (time, event) => {
      synth.triggerAttackRelease(event.note, event.dur, time)
    }, 
    [
      { time: 0,     note: 'E5', dur: '8n' },
      { time: 0.1,   note: 'F5', dur: '8n' },
    ]
  )
  
  let waveform = new Tone.Analyser('waveform', 1024)
  synth.connect(waveform)

  class RectLifeSycle {

    constructor(x, y) {
      this.lifeSycle = []
      for (let i=0; i<1; i+=0.01) {
        this.lifeSycle.push(
          _ => {
            p.stroke(180+180*i, 100, 100)
            p.rect(x, y, 300-300*i, 300-300*i, 10)
          }
        )
      }
    }

    draw() {
      if (this.lifeSycle.length == 0) return 
      this.lifeSycle.pop()()
    }

  }

  let rectLifeSycles = []

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.background(0)
    p.colorMode(p.HSB,360,100,100)
    p.rectMode(p.CENTER)
    part.start(0)
  }

  p.draw = () => {
    // 背景を黒く塗る
    p.background(0, 0, 0, 200)

    // waveformを描く
    if (!synth || !waveform) return;
    waveform.getValue().forEach(
      (elm, index) => {
        if (index%8!=0) return
        p.stroke(index/1024*200, 100, 100)
        p.strokeWeight(20*elm)
        p.point(index*(p.width/1024), p.height/2 + elm*p.height/2 )
      }
    )

    p.noFill()
    rectLifeSycles.forEach( elm => elm.draw() )
  }

  p.mouseReleased = () => {
    Tone.Transport.toggle()
    rectLifeSycles.push(
      new RectLifeSycle(p.mouseX, p.mouseY)
    )
  }

  

}

new p5(sketch,document.body)