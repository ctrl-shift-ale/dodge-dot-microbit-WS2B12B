function update_background () {
	
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
    velocity_x = velocity_x * friction + acceleration_x * SPEED_TIMESTEP
    if (Math.abs(velocity_x) < 10) {
        velocity_x = 0
    }
    velocity_x = Math.constrain(velocity_x, max_velocity_per_timestep * -1, max_velocity_per_timestep)
    if (player_current_x_pos == 7000 && input.acceleration(Dimension.X) > 0 || player_current_x_pos == 0 && input.acceleration(Dimension.X) < 0) {
        velocity_x = 0
    }
    serial.writeValue("vel x", velocity_x)
}
input.onButtonPressed(Button.A, function () {
    ACTIVE = true
})
function set_player_led () {
    led_index = player_current_x_pos / 1000
    index = DISPLAY.range(led_index, 1)
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
	
}
function update_velocity_y () {
    acceleration_y = input.acceleration(Dimension.Y) * -1
    acceleration_y = Math.constrain(acceleration_y, MAX_VERTICAL_TILT * -1, MAX_VERTICAL_TILT)
    acceleration_y = acceleration_y * 3
    serial.writeValue("accel y", acceleration_y)
    scrolling_timestep_ms = scrolling_timestep_ms * friction + acceleration_y * SPEED_TIMESTEP
    serial.writeValue("scrolling time", scrolling_timestep_ms)
    scrolling_timestep_ms = Math.map(scrolling_timestep_ms, 355, 2020, scrolling_timestep_max_ms, scrolling_timestep_min_ms)
}
/**
 * tilt range (-1023, 1023)
 * 
 * max dot speed = 2 dots per sec
 */
let last_dot_refresh = 0
let refresh_display = false
let acceleration_y = 0
let player_prev_x_pos = 0
let cur_brightness = 0
let compressed_velocity_for_led_colouring = 0
let index: neopixel.Strip = null
let led_index = 0
let velocity_x = 0
let acceleration_x = 0
let DISPLAY: neopixel.Strip = null
let friction = 0
let SPEED_TIMESTEP_MS = 0
let max_velocity_per_timestep = 0
let player_current_x_pos = 0
let player_current_colour = 0
let player_current_brightness = 0
let scrolling_timestep_max_ms = 0
let scrolling_timestep_min_ms = 0
let scrolling_timestep_ms = 0
let SPEED_TIMESTEP = 0
let BRIGHTNESS_PLAYER_MAX = 0
let BRIGHTNESS_PLAYER_MIN = 0
let AQUAMARINE = 0
let BLUE = 0
let GREEN = 0
let ORANGE = 0
let RED = 0
let MAX_VERTICAL_TILT = 0
let HOR_TILT_DEADZONE = 0
let ACTIVE = false
ACTIVE = false
let CENTRE_POS = [3000, 3000]
HOR_TILT_DEADZONE = 100
MAX_VERTICAL_TILT = 400
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
SPEED_TIMESTEP = 0.1
scrolling_timestep_ms = 1000
scrolling_timestep_min_ms = 2000
scrolling_timestep_max_ms = 500
let scrolling_refresh = 0
player_current_brightness = BRIGHTNESS_PLAYER_MIN
player_current_colour = BLUE
player_current_x_pos = 3000
let player_index_past = 3
let REFRESH_DOT_MS = 100
let DOT_MAX_SPEED_UNIT_PER_SEC = 14000
max_velocity_per_timestep = DOT_MAX_SPEED_UNIT_PER_SEC / (1000 / SPEED_TIMESTEP_MS)
let last_tilt_refresh = 0
let tilt = 0
let tilt_accum = 0
friction = 0.66
DISPLAY = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB_RGB)
let single_led = DISPLAY.range(0, 1)
let empty_row = true
basic.forever(function () {
    refresh_display = false
    if (ACTIVE) {
        if (control.millis() - last_tilt_refresh >= 0) {
            update_velocity_x()
            update_velocity_y()
            last_tilt_refresh = control.millis()
        }
        if (control.millis() - last_dot_refresh >= REFRESH_DOT_MS) {
            DISPLAY.clear()
            update_player()
            draw_background()
            set_player_led()
            refresh_display = true
            last_dot_refresh = control.millis()
            last_dot_refresh = control.millis()
        }
    }
    if (refresh_display) {
        DISPLAY.show()
    }
})
