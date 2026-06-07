input.onButtonPressed(Button.A, function () {
    ACTIVE = true
})
function set_player_led (x: number, colour: number, saturation: number, brightness: number) {
    led_index = x / 1000
    if (led_index != player_index_past) {
        index = DISPLAY.range(player_index_past, 1)
        index.showColor(neopixel.hsl(0, 0, 0))
    }
    index = DISPLAY.range(led_index, 1)
    index.showColor(neopixel.hsl(colour, saturation, brightness))
}
function update_gravity () {
    if (Math.abs(input.acceleration(Dimension.X)) > TILT_DEADZONE) {
        tilt = 0
    } else {
        tilt = 0
    }
}
function refresh_dot () {
    if (tilt < 0) {
        player_current_colour = Math.map(tilt, -1023, 0, RED, ORANGE)
    } else if (tilt > 0) {
        player_current_colour = Math.map(tilt, 0, 1023, AQUAMARINE, GREEN)
    } else {
        player_current_colour = BLUE
    }
    player_current_brightness = Math.map(Math.abs(tilt), TILT_DEADZONE, 1023, BRIGHTNESS_PLAYER_MIN, BRIGHTNESS_PLAYER_MAX)
    player_x_pos_current = Math.constrain(player_x_pos_current + Math.map(tilt, -1023, 1023, dot_max_speed_per_period * -1, dot_max_speed_per_period), 0, 7000)
}
/**
 * tilt range (-1023, 1023)
 * 
 * max dot speed = 2 dots per sec
 */
let last_dot_refresh = 0
let tilt_timer = 0
let tilt_trigger = 0
let index: neopixel.Strip = null
let led_index = 0
let DISPLAY: neopixel.Strip = null
let tilt = 0
let dot_max_speed_per_period = 0
let player_index_past = 0
let player_x_pos_current = 0
let player_current_colour = 0
let player_current_brightness = 0
let BRIGHTNESS_PLAYER_MAX = 0
let BRIGHTNESS_PLAYER_MIN = 0
let AQUAMARINE = 0
let BLUE = 0
let GREEN = 0
let ORANGE = 0
let RED = 0
let TILT_DEADZONE = 0
let ACTIVE = false
ACTIVE = false
let CENTRE_POS = [3000, 3000]
TILT_DEADZONE = 100
RED = 0
ORANGE = 40
GREEN = 120
BLUE = 240
let YELLOW = 60
let CYAN = 180
AQUAMARINE = 160
let PURPLE = 300
let BRIGHTNESS_MAX = 50
let BRIGHTNESS_OFF = 0
BRIGHTNESS_PLAYER_MIN = 30
BRIGHTNESS_PLAYER_MAX = 40
player_current_brightness = BRIGHTNESS_PLAYER_MIN
player_current_colour = BLUE
player_x_pos_current = 3000
player_index_past = 3
let REFRESH_TILT_MS = 100
let REFRESH_DOT_MS = 100
let DOT_MAX_SPEED_UNIT_PER_SEC = 2000
dot_max_speed_per_period = DOT_MAX_SPEED_UNIT_PER_SEC / (1000 / REFRESH_TILT_MS)
let last_tilt_refresh = 0
tilt = 0
let tilt_accum = 0
DISPLAY = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB_RGB)
let single_led = DISPLAY.range(0, 1)
basic.forever(function () {
    if (tilt_trigger == 1) {
        tilt_trigger = 0
        tilt_timer = 0
    } else {
        tilt_timer += 1
    }
    if (ACTIVE) {
        if (control.millis() - last_tilt_refresh >= REFRESH_TILT_MS) {
            update_gravity()
            last_tilt_refresh = control.millis()
        }
        if (control.millis() - last_dot_refresh >= REFRESH_DOT_MS) {
            refresh_dot()
            last_dot_refresh = control.millis()
        }
    }
})
