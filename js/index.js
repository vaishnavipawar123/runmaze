const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

canvas.width = 1024 * dpr;
canvas.height = 576 * dpr;

const oceanLayerData = {
  l_New_Layer_1: l_New_Layer_1,
}

const brambleLayerData = {
  l_New_Layer_2: l_New_Layer_2,
}

const layersData = {


  l_New_Layer_5: l_New_Layer_5,
  l_New_Layer_4: l_New_Layer_4,
  l_New_Layer_3: l_New_Layer_3,
  l_New_Layer_6: l_New_Layer_6,
  l_New_Layer_7: l_New_Layer_7,
  l_New_Layer_8: l_New_Layer_8,
};

const tilesets = {
  l_New_Layer_1: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_New_Layer_2: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_New_Layer_5: { imageUrl: './images/tileset.png', tileSize: 16 },
  l_New_Layer_4: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_New_Layer_3: { imageUrl: './images/tileset.png', tileSize: 16 },
  l_New_Layer_6: { imageUrl: './images/decorations.png', tileSize: 16 },
  l_New_Layer_7: { imageUrl: './images/tileset.png', tileSize: 16 },
  l_New_Layer_8: { imageUrl: './images/decorations.png', tileSize: 16 },
};

// Tile setup
const collisionBlocks = [];
const platforms = [];
const blockSize = 16; // Assuming each tile is 16x16 pixels

collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        })
      );
    } else if (symbol === 2) {
      platforms.push(
        new Platform({
          x: x * blockSize,
          y: y * blockSize + blockSize,
          width: 16,
          height: 4,
        })
      );
    }
  });
});

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  const tilesetColumns = Math.floor(tilesetImage.width / tileSize);
  const tilesetRows = Math.floor(tilesetImage.height / tileSize);

  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0 && symbol <= tilesetColumns * tilesetRows) {
        const srcX = ((symbol - 1) % tilesetColumns) * tileSize;
        const srcY = Math.floor((symbol - 1) / tilesetColumns) * tileSize;

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * tileSize,
          y * tileSize, // destination x, y
          tileSize,
          tileSize // destination width, height
        );
      }
    });
  });
};

const renderStaticLayers = async (layersData) => {
  const maxLayerWidth = Math.max(...Object.values(layersData).map(layer => layer[0]?.length || 0)) * blockSize;
  const maxLayerHeight = Object.values(layersData).reduce((acc, layer) => acc + (layer?.length || 0), 0) * blockSize;

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = Math.max(canvas.width, maxLayerWidth);
  offscreenCanvas.height = Math.max(canvas.height, maxLayerHeight);
  const offscreenContext = offscreenCanvas.getContext('2d');

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName];
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl);
        renderLayer(tilesData, tilesetImage, tilesetInfo.tileSize, offscreenContext);
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error);
      }
    }
  }

  return offscreenCanvas;
};

// Player setup
let player = new Player({
  x: 100,
  y: 100,
  size: 32,
  velocity: { x: 0, y: 0 },
});


let oposums = [ 
  new Oposum({
    x: 415,
    y: 100,
    size: 32
  }),
  new Oposum({
    x: 1000,
    y: 100,
    size: 32
  }),
]

let sprites = []
let hearts = [
  new Heart({
    x: 10,
    y: 10,
    width: 21,
    height: 18,
    imageSrc: './images/hearts.png',
    spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
  new Heart({
    x: 33,
    y: 10,
    width: 21,
    height: 18,
    imageSrc: './images/hearts.png',
    spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
  new Heart({
    x: 56,
    y: 10,
    width: 21,
    height: 18,
    imageSrc: './images/hearts.png',
    spriteCropbox: {
      x: 0,
      y: 0,
      width: 21,
      height: 18,
      frames: 6,
    },
  }),
]


const keys = {
  w: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
};

let lastTime = performance.now();
let camera = { x: 0, y: 0 };

const scroll_post_right = 200;
const scroll_post_top = 100;
const scroll_post_bottom = 300;
let oceanbackgroundCanvas = null
let bramblebackgroundCanvas = null
let gems = []
let gemUI=new Sprite({
  x:13, 
  y:36, 
  width:15, 
  height:13, 
  imageSrc:'./images/gem.png',
  SpriteCropbox: {
    x: 0,
    y: 0,
    width: 15,
    height: 13,
    frames: 5,
  },
})

let gemCount=0

function init(){

  gems = []
  gemCount=0 
  gemUI=new Sprite({
    x:13, 
    y:36, 
    width:15, 
    height:13, 
    imageSrc:'./images/gem.png',
    SpriteCropbox: {
      x: 0,
      y: 0,
      width: 15,
      height: 13,
      frames: 5,
    },
  })

  l_gems.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === 18) {
        gems.push(
          new Sprite({
            x:x*16, 
            y:y*16, 
            width:15, 
            height:13, 
            imageSrc:'./images/gem.png',
            SpriteCropbox: {
                x: 0,
                y: 0,
                width: 15,
                height: 13,
                frames: 5,
            },
            hitbox:{
              x:x*16, 
              y:y*16, 
              width:15, 
              height:13,
            },
          }),
        )
      } 
    });
  });

  // Player setup
  player = new Player({
    x: 100,
    y: 100,
    size: 32,
    velocity: { x: 0, y: 0 },
  });


  oposums = [ 
    new Oposum({
      x: 415,
      y: 100,
      size: 32
    }),
    new Oposum({
      x: 1000,
      y: 100,
      size: 32
    }),
  ]

  sprites = []
  hearts = [
    new Heart({
      x: 10,
      y: 10,
      width: 21,
      height: 18,
      imageSrc: './images/hearts.png',
      spriteCropbox: {
        x: 0,
        y: 0,
        width: 21,
        height: 18,
        frames: 6,
      },
    }),
    new Heart({
      x: 33,
      y: 10,
      width: 21,
      height: 18,
      imageSrc: './images/hearts.png',
      spriteCropbox: {
        x: 0,
        y: 0,
        width: 21,
        height: 18,
        frames: 6,
      },
    }),
    new Heart({
      x: 56,
      y: 10,
      width: 21,
      height: 18,
      imageSrc: './images/hearts.png',
      spriteCropbox: {
        x: 0,
        y: 0,
        width: 21,
        height: 18,
        frames: 6,
      },
    }),
  ]
  camera = { 
    x: 0, 
    y: 0 }
    ;


}



function animate(backgroundCanvas) {
  const currentTime = performance.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  player.handleInput(keys);
  player.update(deltaTime, collisionBlocks);

  //opsum update
  for (let i = oposums.length - 1; i >=0; i--){
    const oposum = oposums[i]
    oposum.update(deltaTime, collisionBlocks);

  //jump on enemy
  const collisionDirection = checkCollision(player, oposum)
    if (collisionDirection){

      if(collisionDirection === 'bottom' && !player.isOnGround){
      player.velocity.y = -200
      sprites.push(
        new Sprite({
        x:oposum.x, 
        y:oposum.y, 
        width:32, 
        height:32, 
        imageSrc:'./images/enemy-death.png',
        SpriteCropbox: {
            x: 0,
            y: 0,
            width: 65,
            height: 58,
            frames: 6,
        },
      }),
    )
      oposums.splice(i, 1);
    } else if (
      collisionDirection === 'left' ||
      collisionDirection === 'right'
    ) {
      const fullHearts = hearts.filter((heart) => {
        return !heart.depleted
      })

      if (!player.isInvincible && fullHearts.length > 0) {
        fullHearts[fullHearts.length - 1].depleted = true
      } else if (fullHearts.length === 0) {
        init()
      }

      player.setIsInvincible()
    }
  }
}
  for (let i = sprites.length - 1; i >=0; i--){
    const sprite = sprites[i]
    sprite.update(deltaTime)

    if(sprite.iteration === 1) {
      sprites.splice(i, 1)
    }
  }

  for (let i = gems.length - 1; i >=0; i--){
    const gem = gems[i]
    gem.update(deltaTime)


    //this is where we collect gems
    const collisionDirection = checkCollision(player, gem)
    if (collisionDirection){
      //feedback
      sprites.push(
        new Sprite({
        x:gem.x-8, 
        y:gem.y-8, 
        width:32, 
        height:32, 
        imageSrc:'./images/item-feedback.png',
        SpriteCropbox: {
            x: 0,
            y: 0,
            width: 32,
            height: 32,
            frames: 5,
        },
      }),
    )


      // remove gem
      gems.splice(i, 1)
      gemCount ++ 
    }
  }

 
  // Update camera position only if the player is beyond the scroll position
  if (player.x > scroll_post_right && player.x <1380) {
    const scrollpostdistance = player.x - scroll_post_right
    camera.x = scrollpostdistance
  }

  if (player.y < scroll_post_top && camera.y>0) {
    const scrollpostdistance = scroll_post_top - player.y
    camera.y = scrollpostdistance
  }

  if (player.y > scroll_post_bottom&& camera.y>0) {
    const scrollpostdistance = player.y - scroll_post_bottom;
    camera.y = -scrollpostdistance
  }
  // Prevent the camera from going too far right


  c.save();
  c.scale(dpr+1, dpr+1);
  c.translate(-camera.x, camera.y);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.drawImage(oceanbackgroundCanvas, camera.x*0.32,0)
  c.drawImage(bramblebackgroundCanvas, camera.x*0.16,0)
  c.drawImage(backgroundCanvas, 0, 0);
  player.draw(c);

  for (let i = oposums.length - 1; i >=0; i--){
    const oposum = oposums[i]
    oposum.draw(c)
  }

  for (let i = sprites.length - 1; i >=0; i--){
    const sprite = sprites[i]
    sprite.draw(c)
  }

  for (let i = gems.length - 1; i >=0; i--){
    const gem = gems[i]
    gem.draw(c)
  }


  // c.fillRect(scroll_post_right, 100, 10, 100);
  // c.fillRect(300,scroll_post_top, 100, 10);
  // c.fillRect(300,scroll_post_bottom, 100, 10);
  c.restore();

  c.save();
  c.scale(dpr+1, dpr+1);

  for (let i = hearts.length - 1; i >= 0; i--) {
    const Heart = hearts[i]
    Heart.draw(c)
  }
  gemUI.draw(c)
  c.fillText(gemCount,33,46)
  c.restore();

  // Continue animating if the player is still within the scene
  if (player.x < backgroundCanvas.width) {
    requestAnimationFrame(() => animate(backgroundCanvas));
  }
}

const startRendering = async () => {
  try {
    oceanbackgroundCanvas = await renderStaticLayers(oceanLayerData);
    bramblebackgroundCanvas = await renderStaticLayers(brambleLayerData);
    const backgroundCanvas = await renderStaticLayers(layersData);
    if (!backgroundCanvas) {
      console.error('Failed to create the background canvas');
      return;
    }

    animate(backgroundCanvas);
  } catch (error) {
    console.error('Error during rendering:', error);
  }
};

init()
startRendering();
