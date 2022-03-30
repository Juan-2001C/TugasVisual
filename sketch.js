function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
function setup() {
  createCanvas(400, 400);
}
function draw() {
  background(220);
}
let planets = []
let sun
let numPlanets = 5
let G = 120
let destabilise = 0.00001

function setup() {
  createCanvas(windowWidth,windowHeight)
  sun = new Body(60,createVector(0,0),createVector(0,0))

    // Inisialisasikan Planetnya
  for (let i = 0; i < numPlanets; i++) {
    let massa = random(5, 15)
    let radius = random(sun.d, min(windowWidth/2,windowHeight/2))
    let sudut = random(0, TWO_PI)
    let planetPos = createVector(radius * cos(sudut), radius * sin(sudut))

    // Tentukan Orbit dan kecepatannya
    let planetVel = planetPos.copy()
    if (random(1) < 0.1) planetVel.rotate(-HALF_PI)
    else planetVel.rotate(HALF_PI)  // Direction of orbit
    planetVel.normalize()
    planetVel.mult( sqrt((G * sun.massa)/(radius)) ) // Circular orbit velocity
    planetVel.mult( random( 1-destabilise, 1+destabilise) ) // create elliptical orbit

    planets.push( new Body(massa, planetPos, planetVel) )
  }
}

function draw() {
  background(140)
  translate(width/2, height/2)
  for (let i = numPlanets-1; i >= 0; i--) {
    sun.attract(planets[i])
    planets[i].move()
    planets[i].show()
  }
  sun.show()
}


function Body(_massa, _pos, _vel){
  this.massa = _massa
  this.pos = _pos
  this.vel = _vel
  this.d = this.massa*2
  this.thetaInit = 0
  this.path = []
  this.pathLen = Infinity

  this.show = function() {
    stroke(0,50)
    for (let i = 0; i < this.path.length-2; i++) {
      line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y,)
    }
    fill(45); noStroke()
    ellipse(this.pos.x, this.pos.y, this.d, this.d)
  }


  this.move = function() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.path.push(createVector(this.pos.x,this.pos.y))
    if (this.path.length > 200) this.path.splice(0,1)
  }

  this.applyForce = function(f) {
    this.vel.x += f.x / this.massa
    this.vel.y += f.y / this.massa
  }

  this.attract = function(child) {
    let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y)
    let f = (this.pos.copy()).sub(child.pos)
    f.setMag( (G * this.massa * child.massa)/(r * r) )
    child.applyForce(f)
  }

}