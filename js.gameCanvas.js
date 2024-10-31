const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 850;
canvas.height = 600;

class Player {
  constructor() {
    
    this.velocity = {
      x: 0,
      y: 0
    }
   
    const image = new Image()
    image.src = "newShip.png";
    image.onload = () => {
    const scale = 0.50
    this.image = image
    this.width = image.width * scale
    this.height = image.height * scale
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: canvas.height - this.height - 15
    }
  }
}

draw() {
  ctx.drawImage(
  this.image,
  this.position.x,
  this.position.y,
  this.width,
  this.height
  )
}
  update() {
    if (this.image) {
    this.draw()
    this.position.x += this.velocity.x
    }
  }
}

class Ammo {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.radius = 3
  }
  draw() {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'cyan';
    ctx.fill()
    ctx.closePath()
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

const player = new Player()
const ammoMagazine = [];
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  g: {
    pressed: false
  },
}

function animate() {
  requestAnimationFrame(animate)
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  player.update()

  if (keys.a.pressed && player.position.x >= 0) {
     player.velocity.x = -5
  } 
  else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 5
  } else {
    player.velocity.x = 0
  }
  
}

animate()

document.addEventListener('keydown', ({key}) => {
  switch (key) {
    case 'a':
    keys.a.pressed = true
    break
    case 'd':
    keys.d.pressed = true
    break
   
    case 'g':
    keys.g.pressed = true
    break
  }
});
document.addEventListener('keyup', ({key}) => {
  switch (key) {
    case 'a':
    keys.a.pressed = false
    break
    case 'd':
    keys.d.pressed = false
    break
   
    case 'g':
    keys.g.pressed = false
    break
  }
});
