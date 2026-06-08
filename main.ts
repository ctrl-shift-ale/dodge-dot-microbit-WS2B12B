function update_background () {
    row = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
    ]
    empty_row = !(empty_row)
    if (empty_row == false) {
        score += 1
        n_mines = randint(1, 3)
        mines_pos = []
        for (let index = 0; index <= n_mines - 1; index++) {
            done = false
            while (!(done)) {
                pos = randint(0, 7)
                if (mines_pos.indexOf(pos) == -1) {
                    mines_pos.push(pos)
                    done = true
                }
            }
        }
        for (let value of mines_pos) {
            if (randint(1, 100) > healing_tile_prob) {
                row[value] = 1
            } else {
                row[value] = 2
            }
        }
    }
    for (let value of row) {
        background.push(value)
    }
    for (let index2 = 0; index2 < 8; index2++) {
        background.shift()
    }
}
function update_velocity_x () {
    acceleration_x = input.acceleration(Dimension.X)
    if (Math.abs(acceleration_x) < HOR_TILT_DEADZONE) {
        acceleration_x = 0
        friction = 0.6
    } else {
        friction = 0.9
    }
    serial.writeValue("acceleration x", acceleration_x)
    velocity_x = velocity_x * friction + acceleration_x
    if (Math.abs(velocity_x) < 10) {
        velocity_x = 0
    }
    velocity_x = Math.constrain(velocity_x, max_velocity_per_timestep * -1, max_velocity_per_timestep)
    if (player_current_x_pos == 7000 && input.acceleration(Dimension.X) > 0 || player_current_x_pos == 0 && input.acceleration(Dimension.X) < 0) {
        velocity_x = 0
    }
    serial.writeValue("vel x", velocity_x)
}
function win () {
    state = "WIN"
    basic.clearScreen()
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funk), music.PlaybackMode.InBackground)
    basic.showIcon(IconNames.Heart)
    basic.pause(1000)
    basic.showString("YOU WON!! CONGRATULATIONS")
    basic.pause(500)
    basic.showNumber(score)
    basic.clearScreen()
    basic.pause(500)
    state = "READY"
}
function game_over () {
    state = "GAME OVER"
    DISPLAY.clear()
    basic.clearScreen()
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funeral), music.PlaybackMode.InBackground)
    basic.showString("SCORE")
    basic.pause(500)
    basic.showNumber(score)
    basic.clearScreen()
    basic.pause(500)
    state = "READY"
}
function set_player_led () {
    led_index = player_current_x_pos / 1000
    index = DISPLAY.range(60 + led_index, 1)
    index.showColor(neopixel.hsl(player_current_colour, 50, player_current_brightness))
}
function update_player () {
    compressed_velocity_for_led_colouring = Math.constrain(velocity_x, max_velocity_per_timestep / -4, max_velocity_per_timestep / 4)
    if (velocity_x > 0) {
        player_current_colour = Math.map(compressed_velocity_for_led_colouring, max_velocity_per_timestep / 4, 0, RED, ORANGE)
    } else if (velocity_x < 0) {
        player_current_colour = Math.map(compressed_velocity_for_led_colouring, 0, max_velocity_per_timestep / -4, AQUAMARINE, GREEN)
    } else {
        player_current_colour = BLUE
    }
    cur_brightness = Math.map(Math.abs(velocity_x), 0, max_velocity_per_timestep, 50, 255)
    player_current_brightness = Math.map(Math.abs(velocity_x), 0, max_velocity_per_timestep, BRIGHTNESS_PLAYER_MIN, BRIGHTNESS_PLAYER_MAX)
    player_prev_x_pos = player_current_x_pos
    player_current_x_pos = Math.constrain(player_prev_x_pos + velocity_x, 0, 7000)
    if (player_current_x_pos == player_prev_x_pos) {
        player_current_colour = BLUE
    }
    serial.writeValue("x", player_current_x_pos)
}
function draw_background () {
    for (let led_index = 0; led_index <= background.length - 1; led_index++) {
        tile_brightness = 40
        if (background[led_index] == 1) {
            tile_colour = PURPLE
        } else if (background[led_index] == 2) {
            tile_colour = YELLOW
        } else {
            tile_brightness = 0
        }
        index = DISPLAY.range(led_index, 1)
        index.showColor(neopixel.hsl(tile_colour, 50, tile_brightness))
    }
}
function draw_health_bar () {
	
}
function init_tilt () {
    tilt_accum = 0
    tilt = 0
    HOR_TILT_DEADZONE = 100
    MAX_VERTICAL_TILT = 400
    friction = 0.66
}
input.onButtonPressed(Button.AB, function () {
    basic.clearScreen()
    state = "ON"
    score = 0
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Dadadadum), music.PlaybackMode.InBackground)
    init_health_bar()
})
function check_score () {
    if (score >= SCORE_LIMIT) {
        win()
    }
}
function init_display () {
    BRIGHTNESS_OFF = 0
    RED = 0
    ORANGE = 40
    GREEN = 120
    BLUE = 240
    YELLOW = 60
    CYAN = 180
    AQUAMARINE = 160
    PURPLE = 300
    BRIGHTNESS_MAX = 50
    BRIGHTNESS_PLAYER_MIN = 30
    BRIGHTNESS_PLAYER_MAX = 40
}
function update_velocity_y () {
    let PLAYER_SPEED_TIMESTEP = 0
    acceleration_y = input.acceleration(Dimension.Y) * -1
    acceleration_y = Math.constrain(acceleration_y, MAX_VERTICAL_TILT * -1, MAX_VERTICAL_TILT)
    acceleration_y = acceleration_y * 3
    serial.writeValue("accel y", acceleration_y)
    scrolling_timestep_ms = scrolling_timestep_ms * friction + acceleration_y * PLAYER_SPEED_TIMESTEP
    serial.writeValue("scrolling time", scrolling_timestep_ms)
    scrolling_timestep_ms = Math.map(scrolling_timestep_ms, 355, 2020, SCROLLING_TIMESTEP_MAX_MS, SCROLLING_TIMESTEP_MIN_MS)
}
function init_background () {
    background = []
    for (let index2 = 0; index2 < 64; index2++) {
        background.push(0)
    }
    scrolling_timestep_ms = 1000
    SCROLLING_TIMESTEP_MIN_MS = 2000
    SCROLLING_TIMESTEP_MAX_MS = 500
    scrolling_refresh = 0
    healing_tile_prob = 2
    scrolling_refresh = 0
    empty_row = true
}
function init_health_bar () {
    HEALTH_MAX = 50
    health = 0
}
function init_player () {
    REFRESH_PLAYER_TILE_MS = 100
    PLAYER_SPEED_TIMESTEP_MS = 1000
    player_current_brightness = BRIGHTNESS_PLAYER_MIN
    player_current_colour = BLUE
    player_current_x_pos = 3000
    player_index_past = 3
    PLAYER_MAX_SPEED = 14000
    max_velocity_per_timestep = PLAYER_MAX_SPEED / (1000 / PLAYER_SPEED_TIMESTEP_MS)
}
function update_health (num: number) {
    health = Math.constrain(health + 0, 0, HEALTH_MAX)
    if (health == 0) {
        game_over()
    } else {
        draw_health_bar()
    }
}
let last_dot_refresh = 0
let last_tilt_refresh = 0
let refresh_display = false
let PLAYER_MAX_SPEED = 0
let player_index_past = 0
let PLAYER_SPEED_TIMESTEP_MS = 0
let REFRESH_PLAYER_TILE_MS = 0
let health = 0
let HEALTH_MAX = 0
let scrolling_refresh = 0
let SCROLLING_TIMESTEP_MIN_MS = 0
let SCROLLING_TIMESTEP_MAX_MS = 0
let scrolling_timestep_ms = 0
let acceleration_y = 0
let BRIGHTNESS_MAX = 0
let CYAN = 0
let BRIGHTNESS_OFF = 0
let MAX_VERTICAL_TILT = 0
let tilt = 0
let tilt_accum = 0
let YELLOW = 0
let PURPLE = 0
let tile_colour = 0
let tile_brightness = 0
let player_prev_x_pos = 0
let BRIGHTNESS_PLAYER_MAX = 0
let BRIGHTNESS_PLAYER_MIN = 0
let cur_brightness = 0
let BLUE = 0
let GREEN = 0
let AQUAMARINE = 0
let ORANGE = 0
let RED = 0
let compressed_velocity_for_led_colouring = 0
let player_current_brightness = 0
let player_current_colour = 0
let index: neopixel.Strip = null
let led_index = 0
let player_current_x_pos = 0
let max_velocity_per_timestep = 0
let velocity_x = 0
let friction = 0
let HOR_TILT_DEADZONE = 0
let acceleration_x = 0
let background: number[] = []
let healing_tile_prob = 0
let pos = 0
let done = false
let mines_pos: number[] = []
let n_mines = 0
let empty_row = false
let row: number[] = []
let DISPLAY: neopixel.Strip = null
let score = 0
let SCORE_LIMIT = 0
let state = ""
let ACTIVE = false
state = "INIT"
init_tilt()
init_display()
init_player()
init_background()
SCORE_LIMIT = 100
score = 0
DISPLAY = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB_RGB)
state = "READY"
basic.forever(function () {
    refresh_display = false
    if (state == "ON") {
        if (control.millis() - last_tilt_refresh >= 0) {
            update_velocity_x()
            update_velocity_y()
            last_tilt_refresh = control.millis()
        }
        if (control.millis() - last_dot_refresh >= REFRESH_PLAYER_TILE_MS) {
            DISPLAY.clear()
            update_player()
            draw_background()
            set_player_led()
            refresh_display = true
            last_dot_refresh = control.millis()
            last_dot_refresh = control.millis()
        }
        if (control.millis() - scrolling_refresh >= scrolling_timestep_ms) {
            DISPLAY.clear()
            update_background()
            draw_background()
            set_player_led()
            DISPLAY.show()
            scrolling_refresh = control.millis()
        }
    }
    if (refresh_display) {
        DISPLAY.show()
    }
})
