
class Sprite {
  constructor({ 
    x, 
    y, 
    width , 
    height, 
    imageSrc, 
    SpriteCropbox ={
        x: 0,
        y: 0,
        width: 36,
        height: 28,
        frames: 6,
  },
  hitbox = {
    x:0,
    y:0,
    width:0,
    height:0,
  },
})
   {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.isImageLoaded = false
    this.image = new Image()
    this.image.onload = () => {
      this.isImageLoaded = true
    }
    this.image.src = imageSrc
    this.elapsedTime = 0
    this.currentFrame = 0

    this.currentSprite = SpriteCropbox
    this.iteration=0
    this.hitbox = hitbox


    this.isInvincible = false
    this.isRolling = false
    this.isInAirAfterRolling = false
  }

  setIsInvincible() {
    this.isInvincible = true
    setTimeout(() => {
      this.isInvincible = false
    }, 1500)
  }

  draw(c) {
    // Red square debug code
    //  c.fillStyle = 'rgba(255, 0, 0, 0.5)'
    //  c.fillRect(this.x, this.y, this.width, this.height)

    // Hitbox
    // c.fillStyle = 'rgba(0, 0, 255, 0.5)'
    // c.fillRect(
    //   this.hitbox.x,
    //   this.hitbox.y,
    //   this.hitbox.width,
    //   this.hitbox.height,
    // )

    if (this.isImageLoaded === true) {
      let xScale = 1
      let x = this.x

      c.save()
      if (this.isInvincible) {
        c.globalAlpha = 0.5
      } else {
        c.globalAlpha = 1
      }
      c.scale(xScale, 1)
      c.drawImage(
        this.image,
        this.currentSprite.x + this.currentSprite.width * this.currentFrame,
        this.currentSprite.y,
        this.currentSprite.width,
        this.currentSprite.height,
        x,
        this.y,
        this.width,
        this.height
      )
      c.restore()
    }
  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    // Updating animation frames
    this.elapsedTime += deltaTime
    const secondsInterval = 0.1
    if (this.elapsedTime > secondsInterval) {
      this.currentFrame = (this.currentFrame + 1) % this.currentSprite.frames
      this.elapsedTime -= secondsInterval

      if(this.currentFrame===0){
        this.iteration++
      }
    }

    if (this.isRolling && this.currentFrame === 3) {
      this.isRolling = false
    }

  
  }

  roll() {
    if (this.isOnGround) {
      this.currentSprite = this.sprites.roll
      this.currentFrame = 0
      this.isRolling = true
      this.isInAirAfterRolling = true
      this.velocity.x = this.facing === 'right' ? 300 : -300
    }
  }


}