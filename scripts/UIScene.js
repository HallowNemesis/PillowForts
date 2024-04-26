class UIScene extends Phaser.Scene {

    constructor() {
        super('UIScene')
    }


    create() {

        this.day = 0

        this.dayText = this.add.text(450, 10, 'Objective: Find and Fix \nBreaker Switch', {
            fontSize: '20px',
            bold: true,
            fill: '#ffffff',
            align: 'right',
        })
        this.dayText = this.add.text(450, 60, 'Pick Up Objects and Survive', {
            fontSize: '20px',
            bold: true,
            fill: '#ffffff',
            align: 'right',
        })

        this.dayText = this.add.text(10, 10, 'Day: ' + this.day, {
            fontSize: '32px',
            bold: true,
            fill: '#ffffff',
        })

        this.timer = new StatusBar(this, this.cameras.main.width / 2 - 200, this.cameras.main.height - 50, 0)
    }


    updateDay() {
        this.day += 1
        this.dayText.setText('Day: ' + this.day)

    }
    reset() {
        this.day = 0
        this.dayText.setText('Day: ' + this.day)
        this.timer.updateTime(0);
    }

}