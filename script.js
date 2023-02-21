const gunLeft = document.getElementById("gun-left")
const gunRight = document.getElementById("gun-right")
const enemiesFigure = document.getElementById("enemies-figure")
const friendsFigure = document.getElementById("friends-figure")
const enemiesFigureParent = enemiesFigure.parentElement
const friendsFigureParent = friendsFigure.parentElement
const background = document.getElementById("main")
const redScreen = document.querySelector(".red_screen")
const welcomeWindow = document.querySelector(".main__welcome")
const endGameWindow = document.querySelector(".main__end_game")
const headerStats = document.querySelector(".header__p_container")

/* stats variables */
let miss = 0
let shots = 0
let lifes = 5
let friendsKilled = 0
let hit = 0

/* stats elements*/
const missSpan = document.getElementById("miss")
const shotsSpan = document.getElementById("shots")
const accurancySpan = document.getElementById("accurancy")
const missSpanEnd = document.getElementById("miss-end")
const shotsSpanEnd = document.getElementById("shots-end")
const accurancySpanEnd = document.getElementById("accurancy-end")
const enemiesKilled = document.getElementById("enemies-killed")
const friendsKilledSpan = document.getElementById("friends-killed")
const startButton = document.getElementById("start-button")
const restartButton = document.getElementById("restart-button")
const heartsUl = document.getElementById("hearts-ul")
const offset = 5
let accurancy

let enemyIntervals = {}

const heartsAll = document.querySelector(".main__ul_lifes")
let heartActual = document.querySelector(".main__ul_lifes li:nth-child(" + lifes + ")")
let timeShoot = 1000
let friendInterval

const enemies = {
  octopus: {
    id: "octopus",
    element: document.getElementById("ufo-octopus"),
    css: document.querySelector(".img_ufo_octopus"),
    isAlive: false
  },
  alien: {
    id: "alien",
    element: document.getElementById("alien"),
    css: document.querySelector(".alien"),
    isAlive: false
  },
  ufo: {
    id: "ufo",
    element: document.getElementById("ufo"),
    css: document.querySelector(".ufo"),
    isAlive: false
  }
}

const friends = {
  human: {
    element: document.getElementById("human"),
    css: document.querySelector(".img_human"),
    isAlive: false
  },
  cow: {
    element: document.getElementById("cow"),
    css: document.querySelector(".img_cow"),
    isAlive: false
  },
  kitten: {
    element: document.getElementById("kitten"),
    css: document.querySelector(".img_kitten"),
    isAlive: false
  },
  family: {
    element: document.getElementById("family"),
    css: document.querySelector(".family"),
    isAlive: false
  },
  police: {
    element: document.getElementById("police"),
    css: document.querySelector(".police"),
    isAlive: false
  },
  satelite: {
    element: document.getElementById("satelite"),
    css: document.querySelector(".satelite"),
    isAlive: false
  }
}

function accurancyCalculate() {
  hit = shots - miss
  accurancy = hit / shots * 100
  if (shots+miss===0){
    return "0"
  } else {
    return Math.round(accurancy)
  }
}

function randomNum(parentWidth, parentHeight, btnWidth, btnHeight) {
  return {
      x: Math.floor(Math.random() * (parentWidth - offset * 2 - btnWidth)) + offset,
      y: Math.floor(Math.random() * (parentHeight - offset * 2 - btnHeight)) + offset
  }
}

function enemyRandomPlace(enemy) {
  let { x, y } = randomNum(enemiesFigureParent.offsetWidth, enemiesFigureParent.offsetHeight, enemy.element.offsetWidth, enemy.element.offsetHeight)
  enemy.element.style.right = `${x}px`
  enemy.element.style.bottom = `${y}px`
  enemy.element.classList.add("appear")
  setTimeout(()=>{
    enemy.element.classList.remove("appear")
  },301)
}

function friendRandomPlace(friend) {
  let { x, y } = randomNum(friendsFigureParent.offsetWidth, friendsFigureParent.offsetHeight, friend.element.offsetWidth, friend.element.offsetHeight)
  friend.element.style.right = `${x}px`
  friend.element.style.bottom = `${y}px`
}

function enemyHitStats() {
  shots++
  if(timeShoot>400){
    timeShoot -= 10
  } else {
    timeShoot === 400
  }
  shotsSpan.textContent = shots
  accurancySpan.textContent = accurancyCalculate()
}

function getRandomStartDisplayTime() {
  return Math.floor(Math.random() * (1000 - 500 + 1) + 500)
}

function enemyShoot(enemy) {
  if(enemy.isAlive){
    enemyIntervals[enemy.id] = setInterval(()=> {
      if(lifes>0) {
        heartActual = document.querySelector(".main__ul_lifes li:nth-child(" + lifes + ")")
        heartActual.style.display = "none"
        lifes--
        enemy.element.classList.add("enemy_shot")
        setTimeout(() => {
          enemy.element.classList.remove("enemy_shot")
        }, 501)
        redScreen.style.visibility = "visible"
        setTimeout(()=>{
          redScreen.style.visibility = "hidden"
        },100)
        if(lifes===0){
          endGame()
        }
      }
    },timeShoot*2)
  }
}

function enemyHit(enemy) {
  clearInterval(enemyIntervals[enemy.id])
  enemy.isAlive = false
  let originalSourceImg = enemy.element.getAttribute("src")
  let originalShadowFilter = enemy.css.style.filter
  enemy.element.src = "img/blast.png"
  enemy.element.classList.remove("enemy_shot")
  enemy.element.classList.add("disappear")
  enemy.css.style.filter = "none"
  event.preventDefault()
  event.stopPropagation()
  gunsAnimation()
  setTimeout(()=>{
    enemy.element.src = originalSourceImg
    enemy.css.style.filter = originalShadowFilter
    enemyHitStats()
    enemy.element.classList.remove("disappear")
    enemy.css.style.visibility = "hidden"
  },150)

  setTimeout(()=>{
    enemy.isAlive = true
    enemyRandomPlace(enemy)
    enemy.css.style.visibility = "visible"
    enemyShoot(enemy)
  },timeShoot)
}

function enemy(enemy) {

  enemyRandomPlace(enemy)

  setTimeout(()=> {
    enemy.css.style.visibility = "visible"
    enemy.isAlive = true
    enemy.element.classList.add("appear")
    setTimeout(()=>{
      enemy.element.classList.remove("appear")
    },301)
    enemyShoot(enemy)
  },getRandomStartDisplayTime())

  enemy.element.addEventListener("mouseup", ()=>{
    enemyHit(enemy)
  })

  enemy.element.addEventListener("touchend", ()=>{
    enemyHit(enemy)
  })

}

function gunsAnimation() {
  if (Math.random() < 0.5) {
    gunLeft.classList.add("gun_left_animation", "gun_left_shadow")
    setTimeout(() => {
      gunLeft.classList.remove("gun_left_animation", "gun_left_shadow")
    }, 101)
  } else {
    gunRight.classList.add("gun_right_animation", "gun_right_shadow")
    setTimeout(() => {
      gunRight.classList.remove("gun_right_animation", "gun_right_shadow")
    }, 101)
  }
}

function friendHitStatsUpdate(friend) {
  friend.isAlive = false
  shots++
  miss++
  friendsKilled++
  shotsSpan.textContent = shots
  missSpan.textContent = miss
  accurancySpan.textContent = accurancyCalculate()
}

function friendHit(friend) {

  let originalSourceImg = friend.element.getAttribute("src")
  let originalShadowFilter = friend.css.style.filter
  friend.element.classList.remove("rotate")

  friend.element.src = "img/blast.png"
  friend.element.classList.add("disappear")
  friend.css.style.filter = "none"
  event.preventDefault()
  event.stopPropagation()
  gunsAnimation()
  friendHitStatsUpdate(friend)
  setTimeout(()=>{
    friend.element.src = originalSourceImg
    friend.css.style.filter = originalShadowFilter
    friend.css.style.visibility = "hidden"
    friend.element.classList.remove("disappear")
  },150)
}

function friend(friend) {
  
  let randomFriendDisplayTime = getRandomStartDisplayTime()

  friendInterval = setInterval(() => {
    friendRandomPlace(friend)
    friend.isAlive = true
    friend.css.style.visibility = "visible"
    friend.element.classList.add("appear")
    setTimeout(()=>{
      friend.element.classList.remove("appear")
      friend.element.classList.add("rotate")
    },301)
    setTimeout(()=>{
      friend.element.classList.remove("rotate")
      friend.element.classList.add("disappear")
    }, randomFriendDisplayTime*4-200)
    setTimeout(() => {
      friend.isAlive = false
      friend.element.classList.remove("disappear")
      friend.css.style.visibility = "hidden"
      }, randomFriendDisplayTime*4)
    randomFriendDisplayTime = getRandomStartDisplayTime()
    }, randomFriendDisplayTime*8)

  friend.element.addEventListener("mouseup", ()=> {
    friendHit(friend)
  })
  friend.element.addEventListener("touchend", ()=> {
    friendHit(friend)
  })
}

function missBackgroundShot(event) {
  miss++
  shots++
  shotsSpan.textContent = shots
  missSpan.textContent = miss
  accurancySpan.textContent = accurancyCalculate()
  event.preventDefault()
  gunsAnimation()
}

function game(){

  background.addEventListener("mouseup", missBackgroundShot)
  background.addEventListener("touchend", missBackgroundShot)
  
  enemy(enemies.octopus)
  enemy(enemies.alien)
  enemy(enemies.ufo)

  friend(friends.human)
  friend(friends.cow)
  friend(friends.kitten)
  friend(friends.family)
  friend(friends.police)
  friend(friends.satelite)
}

function startGame(event) {
  event.preventDefault()
  event.stopPropagation()
  welcomeWindow.style.display = "none"
  headerStats.style.display = "flex"
  heartsAll.style.visibility = "visible"
  game()
}

function hideCharacters(enemies, friends) {
  for (let enemy of Object.values(enemies)) {
    setTimeout(()=>{
      enemy.element.classList.remove("enemy_shot")
      enemy.element.classList.remove("disappear")
      enemy.element.classList.add("disappear")
    }, 100)
    setTimeout(()=>{
      enemy.css.style.display = "none"
    }, 301)
  }
  for (let friend of Object.values(friends)){
    setTimeout(()=>{
      friend.element.classList.remove("disappear")
      friend.element.classList.add("disappear")
    }, 100)
    setTimeout(()=>{
      friend.css.style.display = "none"
    }, 301)
  }
}

function endGame() {
  
  clearInterval(friendInterval)
  hideCharacters(enemies, friends)

  endGameWindow.style.visibility = "visible"
  enemiesKilled.textContent = hit
  friendsKilledSpan.textContent = friendsKilled
  shotsSpanEnd.textContent = shots
  missSpanEnd.textContent = miss
  accurancySpanEnd.textContent = accurancyCalculate()
  headerStats.style.display = "none"
}

startButton.addEventListener("mouseup", startGame)
startButton.addEventListener("touchend", startGame)
restartButton.addEventListener("mouseup", () => {
  event.preventDefault()
  event.stopPropagation()
  location.reload()
})
restartButton.addEventListener("touchend", (event) => {
  event.preventDefault()
  event.stopPropagation()
  location.reload()
})
