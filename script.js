// 获取画布和按钮元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const eatSound = document.getElementById('eatSound');
const bgMusic = document.getElementById('bgMusic');
const musicButton = document.getElementById('musicButton');

// 设置画布大小
canvas.width = 800;
canvas.height = 800;

// 初始化游戏变量
const gridSize = 40; // 网格大小
let snake = [{x: 400, y: 400}]; // 蛇的初始位置
let food = {x: 0, y: 0}; // 食物位置
let direction = 'right'; // 初始方向
let score = 0; // 分数
let gameSpeed = 400; // 游戏速度（毫秒）
let gameLoop; // 游戏循环变量
let isMusicPlaying = false;
let isPaused = false;  // 添加暂停状态变量

// 加载图片
const foodImage = new Image();
const snakeImage = new Image();
let imagesLoaded = 0;

// 图片加载处理
foodImage.onload = function() {
    imagesLoaded++;
};

snakeImage.onload = function() {
    imagesLoaded++;
};

foodImage.src = '2.png';
snakeImage.src = '1.png';

// 开始按钮点击事件
startButton.addEventListener('click', function() {
    startScreen.style.display = 'none';
    isPaused = false;  // 重置暂停状态
    generateFood();
    gameLoop = setInterval(gameUpdate, gameSpeed);
    bgMusic.play().catch(function(error) {
        console.log("音乐播放失败");
    });
    isMusicPlaying = true;
});

// 音乐按钮点击事件
musicButton.addEventListener('click', function() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicButton.textContent = '🔈';
    } else {
        bgMusic.play();
        musicButton.textContent = '🔊';
    }
    isMusicPlaying = !isMusicPlaying;
});

// 生成食物的函数
function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

// 圆角矩形函数
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// 画蛇的函数
function drawSnake() {
    snake.forEach(segment => {
        ctx.save();
        ctx.beginPath();
        roundRect(
            ctx, 
            segment.x + 1, 
            segment.y + 1, 
            gridSize - 4, 
            gridSize - 4, 
            10
        );
        ctx.clip();
        ctx.drawImage(snakeImage, segment.x + 1, segment.y + 1, gridSize - 4, gridSize - 4);
        ctx.restore();
    });
}

// 画食物的函数
function drawFood() {
    ctx.save();
    ctx.beginPath();
    roundRect(
        ctx, 
        food.x + 1, 
        food.y + 1, 
        gridSize - 4, 
        gridSize - 4, 
        10
    );
    ctx.clip();
    ctx.drawImage(foodImage, food.x + 1, food.y + 1, gridSize - 4, gridSize - 4);
    ctx.restore();
}

// 画网格的函数
function drawGrid() {
    ctx.strokeStyle = '#2a573f';
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// 移动蛇的函数
function moveSnake() {
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch(direction) {
        case 'up': head.y -= gridSize; break;
        case 'down': head.y += gridSize; break;
        case 'left': head.x -= gridSize; break;
        case 'right': head.x += gridSize; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        generateFood();
        // 播放吃食物音效
        eatSound.currentTime = 0;
        eatSound.play().catch(function(error) {
            console.log("音效播放失败");
        });
    } else {
        snake.pop();
    }
}

// 检查游戏结束
function checkGameOver() {
    const head = snake[0];
    
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 游戏主循环
function gameUpdate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制深绿色背景
    ctx.fillStyle = '#1a4731';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 添加"坤"字
    ctx.save();
    ctx.font = '400px Arial';  // 可以调整字体大小
    ctx.fillStyle = '#1d5438';  // 略深一点的绿色
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('祎楠', canvas.width/2, canvas.height/2);
    ctx.restore();
    
    drawGrid();
    moveSnake();
    
    if (checkGameOver()) {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1a4731';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        alert(`游戏结束！得分：${score}`);
        clearInterval(gameLoop);
        startScreen.style.display = 'flex';
        
        // 重置游戏状态
        snake = [{x: 200, y: 200}];
        direction = 'right';
        score = 0;
        
        return;
    }
    
    drawSnake();
    drawFood();
}

// 键盘控制
document.addEventListener('keydown', function(event) {
    event.preventDefault();
    
    const key = event.key;
    
    // 空格键暂停
    if (key === ' ') {
        if (!isPaused) {
            clearInterval(gameLoop);
            isPaused = true;
            
            // 显示暂停文字
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('游戏暂停', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillText('按空格键继续', canvas.width/2, canvas.height/2 + 40);
        } else {
            gameLoop = setInterval(gameUpdate, gameSpeed);
            isPaused = false;
        }
        return;
    }
    
    // 方向键控制
    if (!isPaused) {
        if (key === 'ArrowUp' && direction !== 'down') {
            direction = 'up';
        } else if (key === 'ArrowDown' && direction !== 'up') {
            direction = 'down';
        } else if (key === 'ArrowLeft' && direction !== 'right') {
            direction = 'left';
        } else if (key === 'ArrowRight' && direction !== 'left') {
            direction = 'right';
        }
    }
});
// 在文件末尾添加触摸控制代码
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', function(event) {
    event.preventDefault();
});

document.addEventListener('touchend', function(event) {
    if (isPaused) return;  // 如果游戏暂停，不处理滑动

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (deltaX > 0 && direction !== 'left') {
            direction = 'right';
        } else if (deltaX < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else {
        // 垂直滑动
        if (deltaY > 0 && direction !== 'up') {
            direction = 'down';
        } else if (deltaY < 0 && direction !== 'down') {
            direction = 'up';
        }
    }
});

// 添加暂停按钮（因为手机没有空格键）
const pauseButton = document.createElement('button');
pauseButton.textContent = '暂停';
pauseButton.style.position = 'fixed';
pauseButton.style.top = '10px';
pauseButton.style.right = '10px';
pauseButton.style.zIndex = '1000';
document.body.appendChild(pauseButton);

pauseButton.addEventListener('click', function() {
    if (!isPaused) {
        clearInterval(gameLoop);
        isPaused = true;
        pauseButton.textContent = '继续';
        
        // 显示暂停文字
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('游戏暂停', canvas.width/2, canvas.height/2);
    } else {
        gameLoop = setInterval(gameUpdate, gameSpeed);
        isPaused = false;
        pauseButton.textContent = '暂停';
    }
});