function engine() {
	this.oMain = $("main");
	this.aLi = $("option").children;
	this.init();
}
engine.prototype.init = function() {
	var that = this;
	for(let i = 0; i < this.aLi.length; i++) {
		this.aLi[i].onclick = function() {
			that.oMain.className = "main main_se"
			that.aLi[0].parentNode.remove();
			that.load = createDiv("load");
			that.loading = createDiv("loading");
			that.score = createDiv("Score");
			that.hard = i;

			var mainBpos = 0
			setInterval(() => {
				mainBpos += 10;
				that.oMain.style.backgroundPositionY = mainBpos + "px";
			}, 100)

			var loadingIndex = 0;
			setInterval(() => {
				loadingIndex++;
				that.loading.style.backgroundImage = "url(images/loading" + (loadingIndex % 3 + 1) + ".png)"
			}, 400)

			setTimeout(() => {
				that.load.remove();
				that.loading.remove();
				that.gamestart();
			}, 1500)
		}
	}
}
engine.prototype.gamestart = function() {
	plane.init(this.oMain);
	plane.fire(this.hard);

	setInterval(() => {
		Math.random() > 0.5 ? new Enemy(this.oMain).init(1) : "";
	}, 1000)
	setInterval(() => {
		Math.random() > 0.7 ? new Enemy(this.oMain).init(2) : "";
	}, 2000)
	setInterval(() => {
		Math.random() > 0.8 ? new Enemy(this.oMain).init(3) : "";
	}, 3000)

	zb.init();
}
new engine();
var plane = {
	init: function(main) {
		this.main = main;
		this.ele = createDiv("plane");
		this.ele.style.bottom = 0;
		this.ele.style.left = (this.main.offsetWidth - this.ele.offsetWidth) / 2 + "px";
		this.leftarr = [];
		this.toparr = [];
		document.onmousemove = (eve) => {
			var e = eve || window.event;
			this.move(e);
		}
	},
	move: function(e) {
		var l = e.clientX - this.main.offsetLeft - this.ele.offsetWidth / 2;
		var t = e.clientY - this.main.offsetTop - this.ele.offsetHeight / 2;
		this.leftarr.push(e.clientX);
		for(i = 0; i < this.leftarr.length; i++) {
			if(this.leftarr[i] > this.leftarr[i + 1]) {
				this.ele.className = "plane plane_left"
			}
			if(this.leftarr[i] < this.leftarr[i + 1]) {
				this.ele.className = "plane plane_right"
			}
		}
		maxLeft = this.main.offsetWidth - this.ele.offsetWidth;
		l = l < 0 ? 0 : l
		l = l > maxLeft ? maxLeft : l
		t = t < 0 ? 0 : t
		this.ele.style.left = l + "px";
		this.ele.style.top = t + "px";
	},
	fire: function(hard) {
		this.hard = hard;
		this.nandu = 0;
		switch(this.hard) {
			case 0:
				this.nandu = 500;
				break;
			case 1:
				this.nandu = 350;
				break;
			case 2:
				this.nandu = 200;
				break;
			case 3:
				this.nandu = 60;
				break;
		}
		setInterval(() => {
			this.aBullet.push(new Bullet())
		}, this.nandu)
	},
	aBullet: [],
	die: function() {
		this.ele.className = "plane_die"
		var planedie = 0;
		setInterval(() => {
			planedie++;
			this.ele.style.backgroundImage = "url(images/me_die" + (planedie % 3 + 1) + ".png)"
		}, 300)
		setTimeout(() => {
			this.ele.remove();
		}, 900)
	}
}

function Bullet() {
	this.init();
}
Bullet.prototype = {
	constructor: Bullet,
	init: function() {
		this.ele = createDiv("Bullet");
		this.ele.style.top = plane.ele.offsetTop - this.ele.offsetHeight + "px";
		this.ele.style.left = plane.ele.offsetLeft + plane.ele.offsetWidth / 2 - this.ele.offsetWidth / 2 + "px";
		this.move();
	},
	move: function() {
		this.ele.timer = setInterval(() => {
			this.ele.style.top = this.ele.offsetTop - 10 + "px"
			if(this.ele.offsetTop < 0) {
				this.die();
			}
		}, 50)
	},
	die: function() {
		clearInterval(this.ele.timer)
		this.ele.className = "Bullet_die";
		var Bulletdie = 0;
		setInterval(() => {
			Bulletdie++;
			this.ele.style.backgroundImage = "url(images/die" + (Bulletdie % 3 + 1) + ".png)"
		}, 300)
		setTimeout(() => {
			this.ele.remove();
		}, 400)
		for(i = 0; i < plane.aBullet.length; i++) {
			if(plane.aBullet[i] == this) {
				plane.aBullet.splice(i, 1)
			}
		}
	}
}

var score = 0;
class Enemy {
	constructor(main) {
		this.main = main;
		zb.arr.push(this);
	}
	init(type) {
		switch(type) {
			case 1:
				this.ele = createDiv("Enemy-small");
				this.speed = 5;
				this.hp = 2;
				break;
			case 2:
				this.ele = createDiv("Enemy-middle");
				this.speed = 3;
				this.hp = 5;
				break;
			case 3:
				this.ele = createDiv("Enemy-large");
				this.speed = 1;
				this.hp = 10;
				break;
		}
		let max = this.main.offsetWidth - this.ele.offsetWidth;
		let random = Math.round(Math.random() * max);
		this.ele.style.left = random + "px";
		this.ele.style.top = -this.ele.offsetHeight + "px"
		this.move();
	}
	move() {
		this.ele.timer = setInterval(() => {
			this.ele.style.top = this.ele.offsetTop + this.speed + "px";
			if(this.ele.offsetTop > this.main.offsetHeight + 50) {
				this.die();
			}
			for(let i = 0; i < plane.aBullet.length; i++) {
				if(plane.aBullet[i].ele.offsetLeft + plane.aBullet[i].ele.offsetWidth > this.ele.offsetLeft) {
					if(plane.aBullet[i].ele.offsetLeft < this.ele.offsetWidth + this.ele.offsetLeft) {
						if(plane.aBullet[i].ele.offsetTop < this.ele.offsetTop + this.ele.offsetHeight) {
							plane.aBullet[i].die();
							this.hp--;
							if(this.hp == 0) {
								this.die();
							}
						}
					}
				}

			}
			if(plane.ele.offsetLeft + plane.ele.offsetWidth > this.ele.offsetLeft) {
				if(plane.ele.offsetLeft < this.ele.offsetWidth + this.ele.offsetLeft) {
					if(plane.ele.offsetTop < this.ele.offsetTop + this.ele.offsetHeight) {
						plane.die();
						setTimeout(() => {
							alert("撞机了");
							location.reload();
						}, 1800)
					}
				}
			}
		}, 50)
	}
	die() {
		if(this.ele.className == "Enemy-small") {
			var EnemySmalldie = 0;
			setInterval(() => {
				EnemySmalldie++;
				this.ele.style.backgroundImage = "url(images/plain1_die" + (EnemySmalldie % 4) + ".png)"
			}, 300)
			setTimeout(() => {
				this.ele.remove();
			}, 900)
			score++;
		}
		if(this.ele.className == "Enemy-middle") {
			var EnemyMiddledie = 0;
			setInterval(() => {
				EnemyMiddledie++;
				this.ele.style.backgroundImage = "url(images/plain2_die" + (EnemyMiddledie % 5) + ".png)"
			}, 300)
			setTimeout(() => {
				this.ele.remove();
			}, 1200)
			score += 3;
		}
		if(this.ele.className == "Enemy-large") {
			var EnemyLargedie = 0;
			setInterval(() => {
				EnemyLargedie++;
				this.ele.style.backgroundImage = "url(images/plain3_die" + (EnemyLargedie % 7) + ".png)"
			}, 300)
			setTimeout(() => {
				this.ele.remove();
			}, 1800)
			score += 5;
		}
		clearInterval(this.ele.timer);
		document.getElementsByClassName("Score")[0].innerHTML = score + "分";
		for(i = 0; i < zb.arr.length; i++) {
			if(zb.arr[i] == this) {
				zb.arr.splice(i, 1)
			}
		}
	}
}

var zb = {
	init: function() {
		this.bug = createDiv("bug");
		this.bug.innerHTML = "一键自爆";
		this.dj();
		this.arr = [];
	},
	dj: function() {
		this.bug.onclick = () => {
			this.send();
			this.send();
			this.send();
			this.send();
			this.send();
			this.send();
			this.send();
			this.send();
			this.send();
		}
	},
	send: function() {
		for(i = 0; i < this.arr.length; i++) {
			this.arr[i].die();
		}
	}
}

function $(id) {
	return document.getElementById(id)
}

function createDiv(css) {
	var div = document.createElement("div");
	div.className = css;
	$("main").appendChild(div);
	return div;
}