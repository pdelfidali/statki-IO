var WIN_POINTS = 5;
var game_started = false;
var player_moved = false;

var current_player = 1;

// liczba celnych strzałów oddanych prze danego gracza
var player_points = 0;
var computer_points = 0;

// liczba strzałów oddnaych przez danego gracza
var player_shots = 0;
var computer_shots = 0;

// uchwyty dla pól jako elementów DOM
var b1_square = [];
var b2_square = [];

// numery pól, na których znajdują się statki
var b1_ships = [];
var b2_ships = [];

// numery kolejnych pól w które strzelał każdy z graczy
var b1_shots = [];
var b2_shots = [];

var fields_valid_to_hit_on_player_board = [];

$('#player').html(player_nick);

// początkowe rozstawienie statków dla obu graczy
set_ships(1);
set_ships(2);

var ship_relocation = document.getElementById('ship_relocation');
ship_relocation.addEventListener("click", () => { set_ships(current_player); });

var ships = [];
var second_ships = [];

function start_game() {
    ships = [...b1_ships];
    second_ships = [...b2_ships];
    game_started = true;

    // przypisz do wszystkich pól gracza nr 1 funkcję handle_clicked_field(nr)
    for (let i = 0; i < 100; i++) {
        b1_square[i] = document.getElementById('b1_square' + i);
        b1_square[i].addEventListener("click", () => { handle_clicked_field(i); });
        fields_valid_to_hit_on_player_board.push(i);
    }

    // przypisz do wszystkich pól gracza nr 2 funkcję handle_clicked_field(nr)
    for (let i = 0; i < 100; i++) {
        b2_square[i] = document.getElementById('b2_square' + i);
        b2_square[i].addEventListener("click", () => { handle_clicked_field(i); });
    }

    // wyszarzanie przycisków 'rozpocznij grę' i 'rozstaw statki'
    $('#game_trigger').attr('readonly', 'true');
    $('#ship_relocation').attr('readonly', 'true');

    $('#game_trigger').css('opacity', '0.75');
    $('#ship_relocation').css('opacity', '0.75');

    $('#game_trigger').css('pointer-events', 'none');
    $('#ship_relocation').css('pointer-events', 'none');
    
    current_player = 1;
    hide_ships(2);
    show_ships(1);
    $('#player').html(current_player);

    disable_board('1');
}

// rozmieszcza statki na wybranej planszy
function set_ships(board_nr) {
    let possible_moves = [];
    for (let i = 0; i < 100; i++) {
        possible_moves.push(i);
    }

    hide_ships(board_nr);

    let aleatory_factors = [];

    aleatory_factors[0] = get_random_int(1,6);

    do {
        aleatory_factors[1] = get_random_int(1,6);
    } while (aleatory_factors[0] == aleatory_factors[1]);

    if (board_nr == 1) {
        b1_ships = [];
        
        if (aleatory_factors.indexOf(1) != -1) [b1_ships, possible_moves] = create_ship(4, b1_ships, possible_moves, true);
        if (aleatory_factors.indexOf(2) != -1) [b1_ships, possible_moves] = create_ship(3, b1_ships, possible_moves, true);
        if (aleatory_factors.indexOf(3) != -1) [b1_ships, possible_moves] = create_ship(3, b1_ships, possible_moves, true);
        if (aleatory_factors.indexOf(4) != -1) [b1_ships, possible_moves] = create_ship(2, b1_ships, possible_moves, true);
        if (aleatory_factors.indexOf(5) != -1) [b1_ships, possible_moves] = create_ship(2, b1_ships, possible_moves, true);
        

        if (aleatory_factors.indexOf(1) == -1) [b1_ships, possible_moves] = create_ship(4, b1_ships, possible_moves);
        if (aleatory_factors.indexOf(2) == -1) [b1_ships, possible_moves] = create_ship(3, b1_ships, possible_moves);
        if (aleatory_factors.indexOf(3) == -1) [b1_ships, possible_moves] = create_ship(3, b1_ships, possible_moves);
        if (aleatory_factors.indexOf(4) == -1) [b1_ships, possible_moves] = create_ship(2, b1_ships, possible_moves);
        if (aleatory_factors.indexOf(5) == -1) [b1_ships, possible_moves] = create_ship(2, b1_ships, possible_moves);

        [b1_ships, possible_moves] = create_ship(2, b1_ships, possible_moves); 
        [b1_ships, possible_moves] = create_ship(1, b1_ships, possible_moves);
        [b1_ships, possible_moves] = create_ship(1, b1_ships, possible_moves);
        [b1_ships, possible_moves] = create_ship(1, b1_ships, possible_moves);
        [b1_ships, possible_moves] = create_ship(1, b1_ships, possible_moves); 
    } else if (board_nr == 2) {
        b2_ships = [];
        
        if (aleatory_factors.indexOf(1) != -1) [b2_ships, possible_moves] = create_ship(4, b2_ships, possible_moves, true);
        if (aleatory_factors.indexOf(2) != -1) [b2_ships, possible_moves] = create_ship(3, b2_ships, possible_moves, true);
        if (aleatory_factors.indexOf(3) != -1) [b2_ships, possible_moves] = create_ship(3, b2_ships, possible_moves, true);
        if (aleatory_factors.indexOf(4) != -1) [b2_ships, possible_moves] = create_ship(2, b2_ships, possible_moves, true);
        if (aleatory_factors.indexOf(5) != -1) [b2_ships, possible_moves] = create_ship(2, b2_ships, possible_moves, true);
        

        if (aleatory_factors.indexOf(1) == -1) [b2_ships, possible_moves] = create_ship(4, b2_ships, possible_moves);
        if (aleatory_factors.indexOf(2) == -1) [b2_ships, possible_moves] = create_ship(3, b2_ships, possible_moves);
        if (aleatory_factors.indexOf(3) == -1) [b2_ships, possible_moves] = create_ship(3, b2_ships, possible_moves);
        if (aleatory_factors.indexOf(4) == -1) [b2_ships, possible_moves] = create_ship(2, b2_ships, possible_moves);
        if (aleatory_factors.indexOf(5) == -1) [b2_ships, possible_moves] = create_ship(2, b2_ships, possible_moves);

        [b2_ships, possible_moves] = create_ship(2, b2_ships, possible_moves); 
        [b2_ships, possible_moves] = create_ship(1, b2_ships, possible_moves);
        [b2_ships, possible_moves] = create_ship(1, b2_ships, possible_moves);
        [b2_ships, possible_moves] = create_ship(1, b2_ships, possible_moves);
        [b2_ships, possible_moves] = create_ship(1, b2_ships, possible_moves); 
    }

    if (current_player == 1) {
        show_ships(1);
    } else if (current_player == 2) {
        show_ships(2);
    }
}

function create_ship(size, ships, possible_moves, horizontal = false) {
    let ship_created = false;

    let max_item;
    switch(size) {
        case 2:
            max_item = 88;
            break;
        case 3:
            max_item = 78;
            break;
        case 4:
            max_item = 68;
    }

    // utwórz statek pionowo
    while(!ship_created && horizontal) {
        let item = possible_moves[get_random_int(0, possible_moves.length - size - 1)];
        ship_created = true;

        if (item > max_item) {
            ship_created = false;
        }

        if (ship_created) {
            for (let i=0; i < size; i++) {
                if ( possible_moves[possible_moves.indexOf(item) + i*10] != possible_moves[possible_moves.indexOf(item)] + i*10 ) {
                    ship_created = false;
                    break;
                } else {
                    continue;
                }
            }
        }

        if (ship_created) {
            for (let i=0; i < size; i++) {
                ships.push(item + i*10);
                possible_moves = remove_items_for_hit_field(possible_moves, item + i*10);
            }
        }
    }

    // utwórz statek poziomo
    while (!ship_created && !horizontal) {
        let item = possible_moves[get_random_int(0, possible_moves.length - size - 1)];
        ship_created = true;

        for (let i=0; i < size; i++) {
            if ( possible_moves[possible_moves.indexOf(item + i)] != possible_moves[possible_moves.indexOf(item)] + i ) {
                ship_created = false;
                break;
            } else if (size > 1 && possible_moves[possible_moves.indexOf(item + i + 1)] % 10 == 0) {
                ship_created = false;
                break;
            } else {
                continue;
            }
        }

        if (ship_created) {
            for (let i=0; i < size; i++) {
                ships.push(item + i);
                possible_moves = remove_items_for_hit_field(possible_moves, item + i);
            }
        }
    }
    

    return [ships, possible_moves];
}

function remove_items_for_hit_field(possible_moves, item) {
    possible_moves = remove_single_item(possible_moves, item + 1);
    possible_moves = remove_single_item(possible_moves, item - 1);
    possible_moves = remove_single_item(possible_moves, item + 9);
    possible_moves = remove_single_item(possible_moves, item - 9);
    possible_moves = remove_single_item(possible_moves, item + 10);
    possible_moves = remove_single_item(possible_moves, item - 10);
    possible_moves = remove_single_item(possible_moves, item + 11);
    possible_moves = remove_single_item(possible_moves, item - 11);

    return possible_moves;
}

// pokaż wszystkie niezatopione statki na planszy
function show_ships(board_nr) {
    if (board_nr == 2) {
        return;
    }

    const prefix = (board_nr == 1 ? 'b1_square' : 'b2_square');

    if (board_nr == 1) {
        for (const field of b1_ships) {
            $('#' + prefix + field).removeClass('square');
            $('#' + prefix + field).addClass('square_ship');
        }
    } else if (board_nr == 2) {
        for (const field of b2_ships) {
            $('#' + prefix + field).removeClass('square');
            $('#' + prefix + field).addClass('square_ship');
        }
    }
} 

// ukryj wszystkie statki na danej planszy
function hide_ships(board_nr) {

    const prefix = (board_nr == 1 ? 'b1_square' : 'b2_square');

    if (board_nr == 1) {
        for (const field of b1_ships) {
            $('#' + prefix + field).removeClass('square_ship');
            $('#' + prefix + field).addClass('square');
        }
    } else if (board_nr == 2) {
        for (const field of b2_ships) {
            $('#' + prefix + field).removeClass('square_ship');
            $('#' + prefix + field).addClass('square');
        }
    }
}

// obsługuje naciśnięcie danego pola
function handle_clicked_field(nr) {
    if (current_player == 1) {
        player_shots++;
        b1_shots.push(nr);
        if (b2_ships.includes(nr)) { // przypadek, w którym gracz nr 1 trafił
            player_points++;
            flip_success(nr);
            if (player_points == WIN_POINTS || computer_points == WIN_POINTS) {
                disable_board('1');
                disable_board('2');
                end_game();
            }
        } else { // przypadek, w którym gracz nr 1 spudłował
            flip_failure(nr);
            disable_board('2');
            switch_player();
            trigger_computer_move();
        }
    } else if (current_player == 2) { 
        computer_shots++;
        b2_shots.push(nr);
        fields_valid_to_hit_on_player_board = remove_single_item(fields_valid_to_hit_on_player_board, nr);
        if (b1_ships.includes(nr)) { // przypadek, w którym komputer trafił
            computer_points++; 
            flip_success(nr);
            if (player_points == WIN_POINTS || computer_points == WIN_POINTS) {
                disable_board('1');
                disable_board('2');
                end_game();
            } else {
                trigger_computer_move();
            }
        } else { // przypadek, w którym komputer spudłował
            flip_failure(nr);
            switch_player();
        }
    }
}

function trigger_computer_move() {
    if (level == 'easy') {
        setTimeout(() => {
            field_nr = get_random_item(fields_valid_to_hit_on_player_board);
            handle_clicked_field(field_nr);
        }, 1000);
    } else if (level == 'medium') {
         setTimeout(() => {
             if (get_random_int(0,100) < 85) {
                 field_nr = get_random_item(fields_valid_to_hit_on_player_board);
                 handle_clicked_field(field_nr);
             } else {
                field_nr = get_random_item(fields_valid_to_hit_on_player_board.filter(value => b1_ships.includes(value)));
                handle_clicked_field(field_nr);
             }
         }, 1000);
    } else {
        setTimeout(() => {
             if (get_random_int(0,100) < 15) {
                 field_nr = get_random_item(fields_valid_to_hit_on_player_board);
                 handle_clicked_field(field_nr);
             } else {
                field_nr = get_random_item(fields_valid_to_hit_on_player_board.filter(value => b1_ships.includes(value)));
                handle_clicked_field(field_nr);
             }
         }, 1000);
    }
}

// wywoływana w przypadku celnego strzału
function flip_success(nr) {
    var id_prefix = set_prefix();

    $('#' + id_prefix + nr).removeClass('square');
    $('#' + id_prefix + nr).removeClass('square_ship');
    $('#' + id_prefix + nr).addClass('square_success');
    $('#' + id_prefix + nr).attr("disabled", "disabled");

    if (current_player == 1) {
        b2_ships == remove_single_item(b2_ships, nr);
    } else if (current_player == 2) {
        b1_ships == remove_single_item(b1_ships, nr);
    }
}

// wywoływana w przypadku spudłowania
function flip_failure(nr) {
    var id_prefix = set_prefix();

    $('#' + id_prefix + nr).removeClass('square');
    $('#' + id_prefix + nr).removeClass('square_ship');
    $('#' + id_prefix + nr).addClass('square_fail');
    $('#' + id_prefix + nr).attr("disabled", "disabled");
}

// zamień aktualnego gracza
function switch_player() {
    var board_to_enable = current_player;
    var board_to_hide_ships = board_to_enable;
    var board_to_show_ships = (board_to_hide_ships == 1 ? 2 : 1);
    
    current_player = (current_player == 1 ? 2 : 1);
    if (current_player == 1){
        $('#player').html(player_nick);
    }
    else {
        $('#player').html(computer_nick);
    }

    enable_board(String(board_to_enable));
    if (board_to_hide_ships != 1) {
        hide_ships(board_to_hide_ships);
    }
    
    setTimeout( () => {
        show_ships(board_to_show_ships);
    }, 200 );
}

// blokuje możliwość oddania strzału na danej planszy
function disable_board(nr) {
    for (let i = 0; i < 100; i++) {
        $("#b" + nr + "_square" + i).css("pointer-events", "none");
    }
}

// umożliwia oddawanie strzałów na danej planszy
function enable_board(nr) {
    if (nr == '1') {
        return;
    }

    for (let i = 0; i < 100; i++) {
        $("#b" + nr + "_square" + i).css("pointer-events", "auto");
    }
}

function end_game() {
    if (player_points == WIN_POINTS) {
        var text = "Zwycięża " + player_nick;
    } else if (computer_points == WIN_POINTS) {
        var text = "Zwycięża " + computer_nick;
    }
    alert(text);

    // zablokowanie obu planszy
    () => {
        disable_board('1');
        disable_board('2');
    }

    // przesłanie danych z rozgrywki do serwera
    var game_summary = {
        'player' : player_nick,
        'shots' : player_shots,
        'points' : player_points,
        'second_player' : computer_nick,
        'second_shots' : computer_shots,
        'second_points' : computer_points,
        'ships' : ships,
        'second_ships' : second_ships,
        'shot_list' : b1_shots,
        'second_shot_list' : b2_shots,
    }

    $.ajax({
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(game_summary),
        dataType: "json",
        url: "/game_summary",
        error: function (error) {
            console.log(error)
        }
    })
}

// ustawianie odpowiedniego przedrostka dla uchwytów w jQuery
function set_prefix() {
    return (current_player == 1 ? "b2_square" : "b1_square");
}

function get_random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function remove_single_item(arr, value) {
    var index = arr.indexOf(value);
    if (index != -1) {
        arr.splice(index, 1);
    }

    return arr;
}

function get_random_item(arr) {
    return arr[Math.floor(Math.random()*arr.length)]; 
}
