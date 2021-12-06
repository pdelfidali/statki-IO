show_ships();
var player = 1;
setTimeout(next_move, 1000);

function next_move() {
    if ((player == 1 && b2_shots.length < 1) || (player == 2 && b1_shots.length < 1)) {
        return;
    }
    if (player == 1) {
        handle_shot(b2_shots.splice(0, 1)[0]);
    }
    else {
        handle_shot(b1_shots.splice(0,1)[0]);
    }
    setTimeout(next_move, 1000);
}

function show_ships() {
    for (const field of b1_ships) {
        $('#' + 'b1_square' + field).removeClass('square');
        $('#' + 'b1_square' + field).addClass('square_ship');
    }

    for (const field of b2_ships) {
        $('#' + 'b2_square' + field).removeClass('square');
        $('#' + 'b2_square' + field).addClass('square_ship');
    }
}

function handle_shot(nr) {
    console.log(player + ': ' + nr);

    if (player == 1) {
        if (b2_ships.includes(nr)) {
            flip_success(nr);
        } else {
            flip_failure(nr);
        }
    } else if (player == 2) {
        if (b1_ships.includes(nr)) {
            flip_success(nr);
        } else {
        flip_failure(nr)
        }
    }
}

 function flip_success(nr) {
    var id_prefix = set_prefix();

    $('#' + id_prefix + nr).removeClass('square');
    $('#' + id_prefix + nr).removeClass('square_ship');
    $('#' + id_prefix + nr).addClass('square_success');
    $('#' + id_prefix + nr).attr("disabled", "disabled");

    if (player == 1) {
        b2_ships == remove_single_item(b2_ships, nr);
    } else if (player == 2) {
        b1_ships == remove_single_item(b1_ships, nr);
    }
}

function set_prefix() {
    return (player == 1 ? "b2_square" : "b1_square");
}

function flip_failure(nr) {
    var id_prefix = set_prefix();

    $('#' + id_prefix + nr).removeClass('square');
    $('#' + id_prefix + nr).removeClass('square_ship');
    $('#' + id_prefix + nr).addClass('square_fail');
    $('#' + id_prefix + nr).attr("disabled", "disabled");
    player = (player == 1 ? 2 : 1);
}


function remove_single_item(arr, value) {
    var index = arr.indexOf(value);
    if (index != -1) {
        arr.splice(index, 1);
    }

    return arr;
}
