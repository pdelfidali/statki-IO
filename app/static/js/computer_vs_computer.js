const WIN_POINTS = 20;
var game_started = false;
var player_moved = false;

var current_player = 1;

// liczba celnych strzałów oddanych prze danego gracza
var computer1_points = 0;
var computer2_points = 0;

// liczba strzałów oddnaych przez danego gracza
var computer1_shots = 0;
var computer2_shots = 0;

// uchwyty dla pól jako elementów DOM
var b1_square = [];
var b2_square = [];

// numery pól, na których znajdują się statki
var b1_ships = [];
var b2_ships = [];

// numery kolejnych pól w które strzelał każdy z graczy
var b1_shots = [];
var b2_shots = [];

var fields_valid_to_hit_on_b1 = [];
var fields_valid_to_hit_on_b2 = [];

$("#player").html(computer1_nick);

// początkowe rozstawienie statków dla obu graczy
set_ships(1);
set_ships(2);

var ship_relocation = document.getElementById("ship_relocation");
ship_relocation.addEventListener("click", () => {
  set_ships(current_player);
});

show_ships();
disable_board();

function start_game() {
  game_started = true;

  // przypisz do wszystkich pól gracza nr 1 funkcję handle_clicked_field(nr)
  for (let i = 0; i < 100; i++) {
    b1_square[i] = document.getElementById("b1_square" + i);
    fields_valid_to_hit_on_b1.push(i);
  }

  // przypisz do wszystkich pól gracza nr 2 funkcję handle_clicked_field(nr)
  for (let i = 0; i < 100; i++) {
    b2_square[i] = document.getElementById("b2_square" + i);
    fields_valid_to_hit_on_b2.push(i);
  }

  // wyszarzanie przycisków 'rozpocznij grę' i 'rozstaw statki'
  $("#game_trigger").attr("readonly", "true");
  $("#ship_relocation").attr("readonly", "true");

  $("#game_trigger").css("opacity", "0.75");
  $("#ship_relocation").css("opacity", "0.75");

  $("#game_trigger").css("pointer-events", "none");
  $("#ship_relocation").css("pointer-events", "none");

  current_player = 1;
  $("#player").html(current_player);
  trigger_computer_move(current_player);
}

// rozmieszcza statki na wybranej planszy
function set_ships(board_nr) {
  let possible_moves = [];
  for (let i = 0; i < 100; i++) {
    possible_moves.push(i);
  }

  let aleatory_factors = [];

  aleatory_factors[0] = get_random_int(1, 6);

  do {
    aleatory_factors[1] = get_random_int(1, 6);
  } while (aleatory_factors[0] == aleatory_factors[1]);

  if (board_nr == 1) {
    b1_ships = [];

    if (aleatory_factors.indexOf(1) != -1)
      [b1_ships, possible_moves] = create_ship(
        4,
        b1_ships,
        possible_moves,
        true
      );
    if (aleatory_factors.indexOf(2) != -1)
      [b1_ships, possible_moves] = create_ship(
        3,
        b1_ships,
        possible_moves,
        true
      );
    if (aleatory_factors.indexOf(3) != -1)
      [b1_ships, possible_moves] = create_ship(
        3,
        b1_ships,
        possible_moves,
        true
      );
    if (aleatory_factors.indexOf(4) != -1)
      [b1_ships, possible_moves] = create_ship(
        2,
        b1_ships,
        possible_moves,
        true
      );
    if (aleatory_factors.indexOf(5) != -1)
      [b1_ships, possible_moves] = create_ship(
        2,
        b1_ships,
        possible_moves,
        true
      );

    if (aleatory_factors.indexOf(1) == -1)
      [b1_ships, possible_moves] = create_ship(4, b1_ships, possible_moves);
    if (aleatory_factors.indexOf(2) == -1)
      [b1_ships, possible_moves] = create_ship(3, b1_ships, possible_moves);
    if (aleatory_factors.indexOf(3) == -1)
      [b1_ships, possible_moves] = create_ship(3, b1_ships, possible_moves);
    if (aleatory_factors.indexOf(4) == -1)
      [b1_ships, possible_moves] = create_ship(2, b1_ships, possible_moves);
    if (aleatory_factors.indexOf(5) == -1)
      [b1_ships, possible_moves] = create_ship(2, b1_ships, possible_moves);

    [b1_ships, possible_moves] = create_ship(2, b1_ships, possible_moves);
    [b1_ships, possible_moves] = create_ship(1, b1_ships, possible_moves);
    [b1_ships, possible_moves] = create_ship(1, b1_ships, possible_moves);
    [b1_ships, possible_moves] = create_ship(1, b1_ships, possible_moves);
    [b1_ships, possible_moves] = create_ship(1, b1_ships, possible_moves);
  } else if (board_nr == 2) {
    b2_ships = [];

    if (aleatory_factors.indexOf(1) != -1)
      [b2_ships, possible_moves] = create_ship(
        4,
        b2_ships,
        possible_moves,
        true
      );
    if (aleatory_factors.indexOf(2) != -1)
      [b2_ships, possible_moves] = create_ship(
        3,
        b2_ships,
        possible_moves,
        true
      );
    if (aleatory_factors.indexOf(3) != -1)
      [b2_ships, possible_moves] = create_ship(
        3,
        b2_ships,
        possible_moves,
        true
      );
    if (aleatory_factors.indexOf(4) != -1)
      [b2_ships, possible_moves] = create_ship(
        2,
        b2_ships,
        possible_moves,
        true
      );
    if (aleatory_factors.indexOf(5) != -1)
      [b2_ships, possible_moves] = create_ship(
        2,
        b2_ships,
        possible_moves,
        true
      );

    if (aleatory_factors.indexOf(1) == -1)
      [b2_ships, possible_moves] = create_ship(4, b2_ships, possible_moves);
    if (aleatory_factors.indexOf(2) == -1)
      [b2_ships, possible_moves] = create_ship(3, b2_ships, possible_moves);
    if (aleatory_factors.indexOf(3) == -1)
      [b2_ships, possible_moves] = create_ship(3, b2_ships, possible_moves);
    if (aleatory_factors.indexOf(4) == -1)
      [b2_ships, possible_moves] = create_ship(2, b2_ships, possible_moves);
    if (aleatory_factors.indexOf(5) == -1)
      [b2_ships, possible_moves] = create_ship(2, b2_ships, possible_moves);

    [b2_ships, possible_moves] = create_ship(2, b2_ships, possible_moves);
    [b2_ships, possible_moves] = create_ship(1, b2_ships, possible_moves);
    [b2_ships, possible_moves] = create_ship(1, b2_ships, possible_moves);
    [b2_ships, possible_moves] = create_ship(1, b2_ships, possible_moves);
    [b2_ships, possible_moves] = create_ship(1, b2_ships, possible_moves);
  }
}

function create_ship(size, ships, possible_moves, horizontal = false) {
  let ship_created = false;

  let max_item;
  switch (size) {
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
  while (!ship_created && horizontal) {
    let item =
      possible_moves[get_random_int(0, possible_moves.length - size - 1)];
    ship_created = true;

    if (item > max_item) {
      ship_created = false;
    }

    if (ship_created) {
      for (let i = 0; i < size; i++) {
        if (
          possible_moves[possible_moves.indexOf(item) + i * 10] !=
          possible_moves[possible_moves.indexOf(item)] + i * 10
        ) {
          ship_created = false;
          break;
        } else {
          continue;
        }
      }
    }

    if (ship_created) {
      for (let i = 0; i < size; i++) {
        ships.push(item + i * 10);
        possible_moves = remove_items_for_hit_field(
          possible_moves,
          item + i * 10
        );
      }
    }
  }

  // utwórz statek poziomo
  while (!ship_created && !horizontal) {
    let item =
      possible_moves[get_random_int(0, possible_moves.length - size - 1)];
    ship_created = true;

    for (let i = 0; i < size; i++) {
      if (
        possible_moves[possible_moves.indexOf(item + i)] !=
        possible_moves[possible_moves.indexOf(item)] + i
      ) {
        ship_created = false;
        break;
      } else if (
        size > 1 &&
        possible_moves[possible_moves.indexOf(item + i + 1)] % 10 == 0
      ) {
        ship_created = false;
        break;
      } else {
        continue;
      }
    }

    if (ship_created) {
      for (let i = 0; i < size; i++) {
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

function show_ships() {
  for (const field of b1_ships) {
    $("#" + "b1_square" + field).removeClass("square");
    $("#" + "b1_square" + field).addClass("square_ship");
  }

  for (const field of b2_ships) {
    $("#" + "b2_square" + field).removeClass("square");
    $("#" + "b2_square" + field).addClass("square_ship");
  }
}

// obsługuje naciśnięcie danego pola
function handle_clicked_field(nr) {
  if (current_player == 1) {
    fields_valid_to_hit_on_b2 = remove_single_item(fields_valid_to_hit_on_b2, nr);
    computer1_shots++;
    b1_shots.push(nr);
    if (b2_ships.includes(nr)) {
      // przypadek, w którym gracz nr 1 trafił
      computer1_points++;
      flip_success(nr);
      if (computer1_points == WIN_POINTS) {
        disable_board();
        end_game();
      } else {
        trigger_computer_move(current_player);
      }
    } else {
      // przypadek, w którym gracz nr 1 spudłował
      flip_failure(nr);
      switch_player();
      trigger_computer_move(current_player);
    }
  } else if (current_player == 2) {
    fields_valid_to_hit_on_b1 = remove_single_item(fields_valid_to_hit_on_b1, nr);
    computer2_shots++;
    b2_shots.push(nr);
    if (b1_ships.includes(nr)) {
      // przypadek, w którym komputer trafił
      computer2_points++;
      flip_success(nr);
      if (computer2_points == WIN_POINTS) {
        disable_board();
        end_game();
      } else {
        trigger_computer_move(current_player);
      }
    } else {
      // przypadek, w którym komputer spudłował
      flip_failure(nr);
      switch_player();
      trigger_computer_move(current_player);
    }
  }
}

function trigger_computer_move(computer) {
  if (computer == 1) {
    if (bot1 == "easy") {
      setTimeout(() => {
        field_nr = get_random_item(fields_valid_to_hit_on_b2);
        handle_clicked_field(field_nr);
      }, 1000);
    } else if (bot1 == "medium") {
      setTimeout(() => {
        if (get_random_int(0, 100) < 85) {
          field_nr = get_random_item(fields_valid_to_hit_on_b2);
          handle_clicked_field(field_nr);
        } else {
          let intersection = fields_valid_to_hit_on_b2.filter(x => b2_ships.includes(x));
          field_nr = get_random_item(intersection);
          handle_clicked_field(field_nr);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        if (get_random_int(0, 100) < 50) {
          field_nr = get_random_item(fields_valid_to_hit_on_b2);
          handle_clicked_field(field_nr);
        } else {
          let intersection = fields_valid_to_hit_on_b2.filter(x => b2_ships.includes(x));
          field_nr = get_random_item(intersection);
          handle_clicked_field(field_nr);
        }
      }, 1000);
    }
  } else {
    if (bot2 == "easy") {
      setTimeout(() => {
        field_nr = get_random_item(fields_valid_to_hit_on_b1);
        handle_clicked_field(field_nr);
      }, 1000);
    } else if (bot2 == "medium") {
      setTimeout(() => {
        if (get_random_int(0, 100) < 85) {
          field_nr = get_random_item(fields_valid_to_hit_on_b1);
          handle_clicked_field(field_nr);
        } else {
          let intersection = fields_valid_to_hit_on_b1.filter(x => b1_ships.includes(x));
          field_nr = get_random_item(intersection);
          handle_clicked_field(field_nr);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        if (get_random_int(0, 100) < 50) {
          field_nr = get_random_item(fields_valid_to_hit_on_b1);
          handle_clicked_field(field_nr);
        } else {
          let intersection = fields_valid_to_hit_on_b1.filter(x => b1_ships.includes(x));
          field_nr = get_random_item(intersection);
          handle_clicked_field(field_nr);
        }
      }, 1000);
    }
  }
}

// wywoływana w przypadku celnego strzału
function flip_success(nr) {
  var id_prefix = set_prefix();

  $("#" + id_prefix + nr).removeClass("square");
  $("#" + id_prefix + nr).removeClass("square_ship");
  $("#" + id_prefix + nr).addClass("square_success");
  $("#" + id_prefix + nr).attr("disabled", "disabled");
}

// wywoływana w przypadku spudłowania
function flip_failure(nr) {
  var id_prefix = set_prefix();

  $("#" + id_prefix + nr).removeClass("square");
  $("#" + id_prefix + nr).removeClass("square_ship");
  $("#" + id_prefix + nr).addClass("square_fail");
  $("#" + id_prefix + nr).attr("disabled", "disabled");
}

// zamień aktualnego gracza
function switch_player() {
  current_player = current_player == 1 ? 2 : 1;
  if (current_player == 1) {
    $("#player").html(computer1_nick);
  } else {
    $("#player").html(computer2_nick);
  }
}

// blokuje możliwość oddania strzału na danej planszy
function disable_board() {
  for (let i = 0; i < 100; i++) {
    $("#b1_square" + i).css("pointer-events", "none");
    $("#b2_square" + i).css("pointer-events", "none");
  }
}

// umożliwia oddawanie strzałów na danej planszy
function enable_board(nr) {
  if (nr == "1") {
    return;
  }

  for (let i = 0; i < 100; i++) {
    $("#b" + nr + "_square" + i).css("pointer-events", "auto");
  }
}

function end_game() {
  if (computer1_points == WIN_POINTS) {
    var text = "Zwycięża " + computer1_nick;
    var winner = '1';
  } else if (computer2_points == WIN_POINTS) {
    var text = "Zwycięża " + computer2_nick;
    var winner = '2';
  }
  // zablokowanie obu planszy
  () => {
    disable_board();
  };
  alert(text);

  // przesłanie danych z rozgrywki do serwera
  var game_summary = {
    player: computer1_nick,
    shots: computer1_shots,
    points: computer1_points,
    second_player: computer2_nick,
    second_shots: computer2_shots,
    second_points: computer2_points,
    ships: b1_ships,
    second_ships: b2_ships,
    shot_list: b1_shots,
    second_shot_list: b2_shots,
    winner: winner,
  };

  $.ajax({
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(game_summary),
    dataType: "json",
    url: "/game_summary",
    error: function (error) {
      console.log(error);
    },
  });
}

// ustawianie odpowiedniego przedrostka dla uchwytów w jQuery
function set_prefix() {
  return current_player == 1 ? "b2_square" : "b1_square";
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
  return arr[Math.floor(Math.random() * arr.length)];
}
