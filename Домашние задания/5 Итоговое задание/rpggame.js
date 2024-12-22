class Weapon {
    constructor(name, attack, durability, range) {
        this.name = name;         // Название оружия
        this.attack = attack;     // Сила атаки
        this.durability = durability; // Прочность
        this.thresholdDurability = durability * 0.3; // Граничная прочность (30% от изначальной)
        this.range = range;       // Дальность
    }


    takeDamage(damage) {
        this.durability -= damage;
        if (this.durability < 0) {
            this.durability = 0;
        }

    }

    getDamage() {
        if (this.durability === 0) {
            return 0;
        } else if (this.durability >= this.thresholdDurability) {
            return this.attack;
        } else {
            return this.attack / 2;
        }
    }

    isBroken() {
        return this.durability === 0;
    }
}

// Классы оружия
class Arm extends Weapon {
    constructor() {
        super('Рука', 1, Infinity, 1);
    }
}

class Bow extends Weapon {
    constructor() {
        super('Лук', 10, 200, 3);
    }
}

class Sword extends Weapon {
    constructor() {
        super('Меч', 25, 500, 1);
    }
}

class Knife extends Weapon {
    constructor() {
        super('Нож', 5, 300, 1);
    }
}

class Staff extends Weapon {
    constructor() {
        super('Посох', 8, 300, 2);
    }
}

// Классы усиленного оружия
class LongBow extends Bow {
    constructor() {
        super();
        this.name = 'Длинный лук';
        this.attack = 15;
        this.range = 4;
    }
}

class Axe extends Sword {
    constructor() {
        super();
        this.name = 'Секира';
        this.attack = 27;
        this.durability = 800;
    }
}

class StormStaff extends Staff {
    constructor() {
        super();
        this.name = 'Посох Бури';
        this.attack = 10;
        this.range = 3;
    }
}

class Player{
    constructor(position, name) {
        this.life = 100;
        this.magic = 20;
        this.speed = 1;
        this.attack = 10;
        this.agility = 5;
        this.luck = 10;
        this.description = 'Игрок';
        this.weapon = new Arm();
        this.position = position;
        this.name = name;
    }

    getLuck() {
        const randomNumber = Math.random() * 100;
        return (randomNumber + this.luck) / 100;
    }

    getDamage(distance) {
        if (distance === 0) distance = 1;
        if (distance > this.weapon.range) {
            return 0;
        } else {
            return (this.attack + this.weapon.getDamage()) * this.getLuck() / distance;
        }
    }

    takeDamage(damage) {
        this.life -= damage;
        if (this.life < 0) this.life = 0;
        console.log(`${this.name} получил ${damage.toFixed(2)} урона, оставшаяся жизнь: ${this.life}`);
    }

    isDead() {
        return this.life === 0;
    }

    moveLeft(distance) {
        if (distance > this.speed) {
            this.position -= this.speed;
        } else {
            this.position -= distance;
        }
        console.log(`${this.name} переместился влево, текущая позиция: ${this.position}`);
    }

    moveRight(distance) {
        if (distance > this.speed) {
            this.position += this.speed;
        } else {
            this.position += distance;
        }
        console.log(`${this.name} переместился вправо, текущая позиция: ${this.position}`);
    }

    move(distance) {
        if (distance < 0) {
            this.moveLeft(Math.abs(distance));
        } else {
            this.moveRight(distance);
        }
    }

    isAttackBlocked() {
        return (this.getLuck() > ((100 - this.luck) / 100));
    }

    dodged() {
        return (this.getLuck() > ((100 - this.agility - this.speed * 3) / 100));
    }

    takeAttack(damage) {
        if (this.isAttackBlocked()) {
            console.log(`${this.name} блокировал атаку!`);
            this.weapon.takeDamage(damage);
        } else if (this.dodged()) {
            console.log(`${this.name} увернулся от атаки!`);
        } else {
            this.takeDamage(damage);
        }
    }

    checkWeapon() {
        let cntOfBrokenWeapon = 0;
        if (this.weapon.isBroken() && cntOfBrokenWeapon === 0) {
            console.log(`${this.name} заменяет сломанное оружие на нож.`);
            this.weapon = new Knife();
            ++cntOfBrokenWeapon;
        } else if (this.weapon.isBroken() && cntOfBrokenWeapon === 1) {
            console.log(`${this.name} заменяет оружие на руки.`);
            this.weapon = new Arm();
            ++cntOfBrokenWeapon;
        }
    }

    tryAttack(enemy) {
        let distance = Math.abs(this.position - enemy.position);
        if (this.weapon.range < distance) {
            console.log(`${this.name} недостаточно близко для атаки.`);
            return;
        } else {
            console.log(`${this.name} атакует ${enemy.name}!`);
            this.weapon.takeDamage(10 * this.getLuck());
            if (distance === 0) {
                enemy.moveRight(1);
                enemy.takeAttack(this.getDamage(distance) * 2);
            } else {
                enemy.takeAttack(this.getDamage(distance));
            }
        }
    }

    chooseEnemy(players) {
        let minLifePlayer = null;
        let minLife = Infinity;
        for (let player of players) {
            if (player !== this && player.life < minLife) {
                minLife = player.life;
                minLifePlayer = player;
            }
        }
        if (minLifePlayer) {
            console.log(`${this.name} выбрал целью ${minLifePlayer.name}.`);
        }
        return minLifePlayer;
    }

    moveToEnemy(enemy) {
        console.log(`${this.name} движется к ${enemy.name}.`);
        this.move(enemy.position - this.position);
    }

    turn(players) {
        const enemy = this.chooseEnemy(players);
        if (enemy) {
            this.moveToEnemy(enemy);
            this.tryAttack(enemy);
        }
    }
}

// Классы бойцов
class Warrior extends Player {
    constructor(position, name) {
        super(position, name);
        this.life = 120;
        this.speed = 2;
        this.description = 'Воин';
        this.weapon = new Sword();
    }

    takeDamage(damage) {
        if (this.life < 60 && this.getLuck() > 0.8 && this.magic > 0) {
            this.magic -= damage;
            if (this.magic < 0) {this.magic = 0;}
        } else {
            this.life -= damage;
            if (this.life < 0) {
                this.life = 0;
            }
        }
    }
}

class Archer extends Player {
    constructor(position, name) {
        super(position, name);
        this.life = 80;
        this.magic = 35;
        this.attack = 5;
        this.agility = 10;
        this.description = 'Лучник';
        this.weapon = new Bow();
    }

    getDamage(distance) {
        return (this.attack + this.weapon.getDamage()) * this.getLuck() * distance / this.weapon.range;
    }
}

class Mage extends Player {
    constructor(position, name) {
        super(position, name);
        this.life = 70;
        this.magic = 100;
        this.attack = 5;
        this.agility = 8;
        this.description = 'Маг';
        this.weapon = new Staff();
    }

    takeDamage(damage) {
        if (this.magic > 50) {
            this.life -= (damage / 2);
            if (this.life < 0) {
                this.life = 0;
            }
            this.magic -= 12;
            if (this.magic < 0) {
                this.magic = 0;
            }
        } else {
            this.life -= damage;
            if (this.life < 0) {
                this.life = 0;
            }
        }
    }
}

// Классы улучшеных бойцов
class Dwarf extends Warrior {
    constructor(position, name) {
        super(position, name);
        this.life = 130;
        this.attack = 15;
        this.luck = 20;
        this.description = 'Гном';
        this.weapon = new Axe();
    }


    takeDamage(damage) {
        let cntOfTakeDamage = 0;
        ++cntOfTakeDamage;
        if (cntOfTakeDamage % 6 === 0 && this.getLuck() > 0.5) {
            this.life -= (damage / 2);
            if (this.life < 0) {
                this.life = 0;
            }
        } else {
            this.life -= damage;
            if (this.life < 0) {
                this.life = 0;
            }
        }
    }
}

class Crossbowman extends Archer {
    constructor(position, name) {
        super(position, name);
        this.life = 85;
        this.agility = 8;
        this.luck = 15;
        this.description = 'Арбалетчик';
        this.weapon = new LongBow();
    }
}

class Demiurge extends Mage {
    constructor(position, name) {
        super(position, name);
        this.life = 80;
        this.magic = 120;
        this.attack = 6;
        this.luck = 12;
        this.description = 'Демиург';
        this.weapon = new StormStaff();
    }

    getDamage(distance) {
        if (distance > this.weapon.range) {
            return 0;
        } else if (this.magic > 0 && this.getLuck() > 0.6) {
            return ((this.attack + this.weapon.getDamage()) * this.getLuck() / distance) * 1.5;
        } else {
            return (this.attack + this.weapon.getDamage()) * this.getLuck() / distance;
        }
    }
}


function play(players) {
    console.log("Начало королевской битвы!");

    let round = 1;

    while (players.filter(player => !player.isDead()).length > 1) {
        console.log(`\nРаунд ${round}`);

        // Очистка массива от мёртвых игроков
        players = players.filter(player => !player.isDead());

        // Каждый игрок совершает ход
        for (let player of players) {
            if (!player.isDead()) {
                player.turn(players);
            }
        }

        // Вывод состояния игроков
        players.forEach(player => {
            if (!player.isDead()) {
                console.log(`${player.name} (${player.description}): Жизнь ${player.life}, Магия ${player.magic}, Позиция ${player.position}`);
            } else {
                console.log(`${player.name} (${player.description}) выбывает из битвы.`);
            }
        });

        round++;
    }

    const winner = players.find(player => !player.isDead());
    if (winner) {
        console.log(`\nПобедитель: ${winner.name} (${winner.description}) с ${winner.life} единицами жизни!`);
    } else {
        console.log("Битва окончилась ничьей!");
    }

    // console.log(players.map(player => ({
    //     name: player.name,
    //     life: player.life,
    //     isDead: player.isDead()
    // })));
}
