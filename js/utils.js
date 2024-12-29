const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function checkCollision(Object1, Object2) {
  // Check if there is a collision
  const isColliding =
    Object1.hitbox.x + Object1.hitbox.width > Object2.hitbox.x &&
    Object1.hitbox.x < Object2.hitbox.x + Object2.hitbox.width &&
    Object1.hitbox.y + Object1.hitbox.height > Object2.hitbox.y &&
    Object1.hitbox.y < Object2.hitbox.y + Object2.hitbox.height;

  if (!isColliding) return null;

  // Calculate overlap in both directions
  const xOverlap = Math.min(
    Object1.hitbox.x + Object1.hitbox.width - Object2.hitbox.x,
    Object2.hitbox.x + Object2.hitbox.width - Object1.hitbox.x
  );

  const yOverlap = Math.min(
    Object1.hitbox.y + Object1.hitbox.height - Object2.hitbox.y,
    Object2.hitbox.y + Object2.hitbox.height - Object1.hitbox.y
  );

  // Determine collision side based on overlap
  if (xOverlap < yOverlap) {
    return Object1.hitbox.x < Object2.hitbox.x ? 'right' : 'left';
  } else {
    return Object1.hitbox.y < Object2.hitbox.y ? 'bottom' : 'top';
  }
}

