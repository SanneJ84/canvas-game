
function restart() {
  location.reload()
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var scores = 0
var lives = 3
var killed = 0
var seconds = 2

canvas.width = 850;
canvas.height = 600;

class Player {
  constructor() {
    
    this.velocity = {
      x: 0,
      y: 0
    }
    this.opacity = 1   

    const image = new Image()
    image.src = "newShip2.png";
    image.onload = () => {
    const scale = 0.50
    this.image = image
    this.width = image.width * scale
    this.height = image.height * scale
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: canvas.height - this.height - 5
    }
  }
}

draw() {
  ctx.save()
  ctx.globalAlpha = this.opacity
  ctx.drawImage(
  this.image,
  this.position.x,
  this.position.y,
  this.width,
  this.height
  )
  ctx.restore()
}
  update() {
    if (this.image) {
    this.draw()
    this.position.x += this.velocity.x
    }
  }
}

class Projectile {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.radius = 3.5
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

class InvaderProjectile {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.width = 3
    this.height = 10
  }
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}


class Invader {
  constructor({position}) {
    
    this.velocity = {
      x: 0,
      y: 0
    }
   
    const image = new Image()
    image.src = "alienShip2.png";
    image.onload = () => {
    const scale = 0.2
    this.image = image
    this.width = image.width * scale
    this.height = image.height * scale
    this.position = {
      x: position.x,
      y: position.y
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
  update({velocity}) {
    if (this.image) {
    this.draw()
    this.position.x += velocity.x
    this.position.y += velocity.y
    }
  }
  enemyShoot(invaderProjectiles) {
    invaderProjectiles.push(new InvaderProjectile({
      position: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height
      },
      velocity: {
        x: 0,
        y: 4
      }
    })
   )
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 2.5,
      y: 0
    }
    this.invaders = []
    const columns = Math.floor(Math.random() * 8 + 4)
    const rows = Math.floor(Math.random() * 7 + 2)
    
    this.width = columns * 50

    for (let i = 0; i < columns; i++) {
       for (let j = 0; j < rows; j++) {
      this.invaders.push(new Invader({position: {x: i * 50, y: j * 50}}))
      }
    }
  }
  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.velocity.y = 0 
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
       this.velocity.x = -this.velocity.x
       this.velocity.y = 50
    }
  }
}

class Particle {
  constructor({position, velocity, radius, color, fades}) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades = fades
  }
  draw() {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if (this.fades) this.opacity -= 0.01
  }
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
  
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
 
  g: {
    pressed: false
  },
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let died = false
let stopGame = false

function statsOut() {
  document.getElementById('counted').innerHTML = "Score: " + scores;
  document.getElementById('shooted').innerHTML = "Kills: " + killed;
}

function gameReset() {
  if (lives <= 0) {
     died = true
      setTimeout(() => {
        stopGame = true
        stopFuncs()
       }, 2000)
     
     document.getElementById('live').innerHTML = "Lives: 0";
  } else {
    document.getElementById('live').innerHTML = "Lives: " + lives;
  }
}

function stopFuncs() {
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.textAlign = 'center'
  ctx.font = '120px Brush Script MT'
  ctx.fillStyle = 'red'
  ctx.fillText("Game over...", canvas.width / 2, canvas.height / 2)
}

function respawn() {
  player.opacity = 1
  died = false
}

for (let i = 0; i < 100; i++) {      
  particles.push(new Particle({
    position: {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    },
    velocity: { 
      x: 0,
      y: 0.4
    },
    radius: Math.random() * 2,
    color: 'white'
      })
     )
   }
function createParticles({object, color, fades}) {
  for (let i = 0; i < 15; i++) {      
      particles.push(new Particle({
         position: {
	   x: object.position.x + object.width / 2,
	   y: object.position.y + object.height / 2
	 },
	 velocity: { 
	   x: (Math.random() - 0.5) * 4,
	   y: (Math.random() - 0.5) * 4
         },
	 radius: Math.random() * 3,
	 color: color,
         fades: true
      })
     )
   }
}

function animate() {
  if (stopGame) return 
  requestAnimationFrame(animate)
  
  var img = new Image();  
  img.src = "gameBG2.png";
  var imgHeight = 0;
  var imgWidth = canvas.width;
  ctx.drawImage(img, 0, imgHeight);
  ctx.drawImage(img, 0, imgHeight - canvas.height);
    
  //ctx.fillStyle = 'black'
  //ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  player.update()

  particles.forEach((particle, index) => {
    if (particle.position.y - particle.radius >= canvas.height) {
       particle.position.x = Math.random() * canvas.width
       particle.position.y = -particle.radius
    }

    if (particle.opacity <= 0) {
       setTimeout(() => {
         particles.splice(index, 1)    
       }, 0)
    } else {
      particle.update()
    }  
  })

  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
       setTimeout(() => {
         invaderProjectiles.splice(index, 1)
       }, 0)
    } else {
      invaderProjectile.update()
     }
    // enemy kill player
    if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
	invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
        invaderProjectile.position.x <= player.position.x + player.width) {
        
          playExplosionSound()

        setTimeout(() => {
         invaderProjectiles.splice(index, 1)
         lives = lives -1
	 player.opacity = 0
         died = true
         gameReset()
       }, 0)

	 setTimeout(() => {
          respawn()
       }, 2000)

        createParticles({
          object: player,
          color: 'lightblue',
          fades: true
	})
     }
  })

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
       setTimeout(() => {
         projectiles.splice(index, 1)
       }, 0)
    
    } else {
      projectile.update()
    }
  })

  grids.forEach((grid, gridIndex) => {
    grid.update()

  if (frames % 100 === 0 && grid.invaders.length > 0) {
     grid.invaders[Math.floor(Math.random() * grid.invaders.length)].enemyShoot(invaderProjectiles)
    }

    grid.invaders.forEach((invader, a) => {
      invader.update({velocity: grid.velocity})
	
      //kill enemy
      projectiles.forEach((projectile, b)=> {
        if (
	  projectile.position.y - projectile.radius <=
	    invader.position.y + invader.height &&
	  projectile.position.x + projectile.radius >=
	    invader.position.x &&
	  projectile.position.x - projectile.radius <=
	    invader.position.x + invader.width && projectile.position.y +
	  projectile.radius >= invader.position.y
	  ) {
	    
	   setTimeout(() => {
	     const invaderFound = grid.invaders.find((invader2) => 
	       invader2 === invader
             )
	     const projectileFound = projectiles.find((projectile2) =>
	     projectile2 === projectile
	     )

             if (invaderFound && projectileFound) {
                scores = scores + 5
                killed = killed + 1
                statsOut()
		createParticles({
		  object: invader,
                  color: 'purple',
                  fades: true
		})

	     grid.invaders.splice(a, 1)
             projectiles.splice(b, 1)

	     if (grid.invaders.length > 0) {
		const firstInvader = grid.invaders[0]
	        const lastInvader = grid.invaders[grid.invaders.length - 1]
		grid.width = lastInvader.position.x - firstInvader.position.x +
                lastInvader.width
		grid.position.x = firstInvader.position.x
	     } else {
	       grids.splice(gridIndex, 1)
             }
	   }
         }, 0)
       }
     })
   })
 })

  if (keys.a.pressed && player.position.x >= 0) {
     player.velocity.x = -5
  } 
  else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 5
  } else {
    player.velocity.x = 0
  }
  if (frames % randomInterval === 0) {
     grids.push(new Grid())
     randomInterval = Math.floor(Math.random() * 500 + 500)
     frames = 0
  }
  frames++
}

animate()


document.addEventListener('keydown', ({key}) => {
  if (died === true) return
  switch (key) {
    case 'a':
    keys.a.pressed = true
    break
    case 'd':
    keys.d.pressed = true
    break
   
    case 'g':
    keys.g.pressed = true
    projectiles.push(
      new Projectile({
        position: {
          x: player.position.x + 48,
          y: player.position.y
        },
        velocity: {
          x: 0,
          y: -8
        }
     })
    )
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
