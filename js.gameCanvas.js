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
      y: canvas.height - this.height - 5
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

class Invader {
  constructor({position}) {
    
    this.velocity = {
      x: 0,
      y: 0
    }
   
    const image = new Image()
    image.src = "alienShip.png";
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
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 2,
      y: 0
    }
    this.invaders = []
    const columns = Math.floor(Math.random() * 8 + 4)
    const rows = Math.floor(Math.random() * 5 + 1)
    
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

const player = new Player()
const projectiles = []
const grids = []
  
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

function animate() {
  requestAnimationFrame(animate)
  
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  player.update()
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
    grid.invaders.forEach((invader, a) => {
      invader.update({velocity: grid.velocity})

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
	     const projectileFound = projectiles.find(projectile2 =>
	     projectile2 === projectile)

             if (invaderFound && projectileFound) {
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
