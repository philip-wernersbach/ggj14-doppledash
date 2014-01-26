// Generated by CoffeeScript 1.6.3
var Grid, defect, defect_size, floor_block, i, player, player_h, player_w, random_num, _i, _ref;

Grid = {
  TILE_INFO: {
    WIDTH: 32,
    HEIGHT: 32
  },
  init: function(tile_height, tile_width) {
    var i, _i, _ref, _results;
    this.HEIGHT_IN_TILES = tile_height;
    this.WIDTH_IN_TILES = tile_width;
    this.HEIGHT_IN_PIXELS = this.TILE_INFO.HEIGHT * this.HEIGHT_IN_TILES;
    this.WIDTH_IN_PIXELS = this.TILE_INFO.WIDTH * this.WIDTH_IN_TILES;
    this.tiles = new Array(Grid.HEIGHT_IN_TILES);
    _results = [];
    for (i = _i = 0, _ref = this.tiles.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      _results.push(this.tiles[i] = new Array(Grid.LENGTH_IN_TILES));
    }
    return _results;
  },
  generate_sprite_tile: function(sprite) {
    var tile;
    tile = Crafty.e('2D, Canvas, Box2D, Block, ' + sprite).attr({
      w: Grid.TILE_INFO.WIDTH,
      h: Grid.TILE_INFO.HEIGHT
    });
    return tile;
  },
  generate_platform: function() {
    return this.generate_sprite_tile('default_platform_sprite');
  },
  generate_yellow_platform: function() {
    var random_num;
    if (!player.colorblind) {
      return this.generate_sprite_tile('yellow_platform_sprite');
    } else {
      random_num = Math.floor((Math.random() * 5) + 1);
      if (random_num === 1 || random_num === 2) {
        return this.generate_sprite_tile('green_platform_sprite');
      } else {
        return this.generate_sprite_tile('yellow_platform_sprite');
      }
    }
  },
  generate_color_tile: function(color) {
    var tile;
    tile = Crafty.e('2D, Canvas, Color, Box2D, Block').color(color).attr({
      w: Grid.TILE_INFO.WIDTH,
      h: Grid.TILE_INFO.HEIGHT
    });
    return tile;
  },
  put_tile: function(tile, row, column) {
    if (this.tiles[row][column]) {
      this.tiles[row][column].destroy();
    }
    this.tiles[row][column] = tile;
    tile.attr({
      y: row * Grid.TILE_INFO.HEIGHT,
      x: column * Grid.TILE_INFO.WIDTH
    });
    return tile.box2d({
      bodyType: 'static'
    });
  },
  Generator: {
    big_block_square: function(cubic_blocks, y_tile, x_tile) {
      var i, j, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= cubic_blocks ? _i < cubic_blocks : _i > cubic_blocks; i = 0 <= cubic_blocks ? ++_i : --_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (j = _j = 0; 0 <= cubic_blocks ? _j < cubic_blocks : _j > cubic_blocks; j = 0 <= cubic_blocks ? ++_j : --_j) {
            _results1.push(Grid.put_tile(Grid.generate_platform(), y_tile - j, x_tile + i));
          }
          return _results1;
        })());
      }
      return _results;
    },
    big_block_square_yellow: function(cubic_blocks, y_tile, x_tile) {
      var i, j, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= cubic_blocks ? _i < cubic_blocks : _i > cubic_blocks; i = 0 <= cubic_blocks ? ++_i : --_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (j = _j = 0; 0 <= cubic_blocks ? _j < cubic_blocks : _j > cubic_blocks; j = 0 <= cubic_blocks ? ++_j : --_j) {
            _results1.push(Grid.put_tile(Grid.generate_yellow_platform(), y_tile - j, x_tile + i));
          }
          return _results1;
        })());
      }
      return _results;
    },
    big_block_rectangle: function(height, length, y_tile, x_tile) {
      var i, j, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= height ? _i < height : _i > height; i = 0 <= height ? ++_i : --_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (j = _j = 0; 0 <= length ? _j < length : _j > length; j = 0 <= length ? ++_j : --_j) {
            _results1.push(Grid.put_tile(Grid.generate_platform(), y_tile - i, x_tile + j));
          }
          return _results1;
        })());
      }
      return _results;
    },
    stairs: function(number, y_tile, x_tile) {
      var i, j, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= number ? _i < number : _i > number; i = 0 <= number ? ++_i : --_i) {
        _results.push((function() {
          var _j, _results1;
          _results1 = [];
          for (j = _j = 0; 0 <= i ? _j < i : _j > i; j = 0 <= i ? ++_j : --_j) {
            _results1.push(Grid.put_tile(Grid.generate_platform(), y_tile - j, x_tile + ((i - 2) * 3)));
          }
          return _results1;
        })());
      }
      return _results;
    },
    cascading_stairs: function(number, length, y_tile, x_tile) {
      var i, j, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= number ? _i < number : _i > number; i = 0 <= number ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref, _ref1, _results1;
          _results1 = [];
          for (j = _j = _ref = (length - (i * 2)) - 2, _ref1 = length - (i * 2); _ref <= _ref1 ? _j < _ref1 : _j > _ref1; j = _ref <= _ref1 ? ++_j : --_j) {
            _results1.push(Grid.put_tile(Grid.generate_platform(), y_tile - i, x_tile + length - j - 3));
          }
          return _results1;
        })());
      }
      return _results;
    },
    down_platform: function(x_tile) {
      var i, _i, _j, _ref, _results;
      for (i = _i = 1, _ref = Grid.HEIGHT_IN_TILES + 1; 1 <= _ref ? _i < _ref : _i > _ref; i = 1 <= _ref ? ++_i : --_i) {
        if (i !== 2 && i !== 3 && i !== 4) {
          Grid.put_tile(Grid.generate_platform(), Grid.HEIGHT_IN_TILES - i, x_tile);
        }
      }
      _results = [];
      for (i = _j = 0; _j <= 2; i = ++_j) {
        _results.push(Grid.put_tile(Grid.generate_yellow_platform(), Grid.HEIGHT_IN_TILES - 2, x_tile + i));
      }
      return _results;
    },
    up_platform: function(x_tile, top_gap) {
      var i, _i, _j, _ref;
      if (top_gap < 2) {
        top_gap = 2;
      }
      for (i = _i = 3, _ref = Grid.HEIGHT_IN_TILES - 1; 3 <= _ref ? _i <= _ref : _i >= _ref; i = 3 <= _ref ? ++_i : --_i) {
        if (i > top_gap) {
          Grid.put_tile(Grid.generate_yellow_platform(), i, x_tile + 1);
        }
      }
      for (i = _j = 0; _j <= 2; i = ++_j) {
        Grid.put_tile(Grid.generate_yellow_platform(), top_gap + 2, x_tile + i);
      }
      return Grid.put_tile(Grid.generate_platform(), top_gap + 2, x_tile + 1);
    },
    Frame: {
      init: function() {
        this.last_frame = '';
        this.last_frame_lowest_y = 0;
        return this.current_x_tile = 1;
      },
      stairs_frame: function() {
        var random_num;
        random_num = Math.floor((Math.random() * 14) + 1);
        Grid.Generator.stairs(random_num, Grid.HEIGHT_IN_TILES - 1, this.current_x_tile);
        this.last_frame_lowest_y = Grid.HEIGHT_IN_TILES - 1 - random_num;
        this.current_x_tile += (random_num - 2) * 3 - 2;
        return this.last_frame = 'stairs';
      },
      cascading_stairs_frame: function() {
        Grid.Generator.cascading_stairs(Grid.HEIGHT_IN_TILES - 5, 20, Grid.HEIGHT_IN_TILES - 1, this.current_x_tile);
        this.current_x_tile += 18;
        this.last_frame = 'stairs';
        return this.last_frame_lowest_y += Grid.HEIGHT_IN_TILES - 1 - 5;
      },
      both_stairs_frame: function() {
        var random_num;
        random_num = Math.floor((Math.random() * 16) + 1);
        this.cascading_stairs_frame();
        this.current_x_tile -= random_num;
        this.stairs_frame();
        return this.last_frame = '';
      },
      squares_frame: function() {
        var biggest_random_x, i, random_num, random_x, random_y, _i;
        random_num = Math.floor((Math.random() * 20) + 10);
        biggest_random_x = 0;
        for (i = _i = 0; 0 <= random_num ? _i < random_num : _i > random_num; i = 0 <= random_num ? ++_i : --_i) {
          random_x = Math.floor(Math.random() * 20);
          random_y = Math.floor(Math.random() * Grid.HEIGHT_IN_TILES - 1);
          if (random_y === Grid.HEIGHT_IN_TILES - 2 || random_y === Grid.HEIGHT_IN_TILES - 3) {
            random_y = Grid.HEIGHT_IN_TILES - 1;
          }
          if (random_y > 2) {
            Grid.Generator.big_block_square_yellow(2, random_y, this.current_x_tile + random_x);
            if (random_x > biggest_random_x) {
              biggest_random_x = random_x;
            }
          }
        }
        this.current_x_tile += biggest_random_x;
        return this.last_frame = '';
      },
      down_platform_frame: function() {
        Grid.Generator.down_platform(this.current_x_tile + 2);
        this.current_x_tile += 6;
        return this.last_frame = '';
      },
      up_platform_frame: function() {
        if (this.last_frame === 'stairs') {
          Grid.Generator.up_platform(this.current_x_tile + 2, this.last_frame_lowest_y - 2);
          this.current_x_tile += 5;
          return this.last_frame = '';
        }
      },
      random_frame: function() {
        var random_num;
        random_num = Math.floor((Math.random() * 6) + 1);
        switch (random_num) {
          case 1:
            return this.stairs_frame();
          case 2:
            return this.cascading_stairs_frame();
          case 3:
            return this.both_stairs_frame();
          case 4:
            return this.squares_frame();
          case 5:
            return this.down_platform_frame();
          case 6:
            return this.up_platform_frame();
        }
      }
    }
  }
};

Crafty.c('InfiniteGrid', {
  init: function() {
    return this;
  },
  infinite_grid_internal: function() {
    if (Grid.Generator.Frame.current_x_tile - (Math.abs(Crafty.viewport.x) / Grid.TILE_INFO.WIDTH) < 40) {
      Grid.Generator.Frame.random_frame();
    }
    return this.timeout(this.infinite_grid_internal, 1);
  },
  infinite_grid: function() {
    Grid.Generator.Frame.random_frame();
    Grid.Generator.Frame.random_frame();
    Grid.Generator.Frame.random_frame();
    return this.timeout(this.infinite_grid_internal, 2000);
  },
  infinite_grid_hard_internal: function() {
    if (Grid.Generator.Frame.current_x_tile - (Math.abs(Crafty.viewport.x) / Grid.TILE_INFO.WIDTH) < 40) {
      if (this.next_hard_frame === 'squares') {
        Grid.Generator.Frame.squares_frame();
        this.next_hard_frame = 'down_platform';
      } else if (this.next_hard_frame === 'down_platform') {
        Grid.Generator.Frame.down_platform_frame();
        this.next_hard_frame = 'stairs';
      } else if (this.next_hard_frame === 'stairs') {
        Grid.Generator.Frame.stairs_frame();
        this.next_hard_frame = 'squares';
      }
    }
    return this.timeout(this.infinite_grid_hard_internal, 1);
  },
  infinite_grid_hard: function() {
    Grid.Generator.Frame.stairs_frame();
    Grid.Generator.Frame.squares_frame();
    Grid.Generator.Frame.down_platform_frame();
    Grid.Generator.Frame.stairs_frame();
    this.next_hard_frame = 'squares';
    return this.timeout(this.infinite_grid_hard_internal, 2000);
  }
});

Crafty.c('ViewportScroll', {
  init: function() {
    return this;
  },
  scroll_right: function() {
    this.last_viewport_x = this.master_viewport_x;
    this.master_viewport_x -= (Grid.TILE_INFO.WIDTH * 17) / 1000;
    Crafty.viewport.scroll('x', this.master_viewport_x);
    return this.timeout(this.scroll_right, 1);
  },
  viewport_scroll: function(tile_height, tile_width) {
    Crafty.viewport.init(Grid.TILE_INFO.WIDTH * tile_width, Grid.TILE_INFO.HEIGHT * tile_height);
    document.getElementById('cr-stage').style.width = '640px';
    document.getElementById('cr-stage').style.height = '480px';
    this.last_viewport_x = 0;
    this.master_viewport_x = Crafty.viewport.x;
    return this.timeout(this.scroll_right, 2000);
  }
});

Crafty.c('PlayerControls', {
  init: function() {
    this.requires('Keyboard');
    return this;
  },
  playerControls: function() {
    this.bind('EnterFrame', function() {
      var desired_vel_x, desired_vel_y, impulse_x, impulse_y, vel, vel_change_x;
      if (this.disableControls) {
        return;
      }
      this.body.SetFixedRotation(true);
      vel = this.body.GetLinearVelocity();
      desired_vel_x = 0;
      desired_vel_y = 0;
      vel_change_x = 0;
      if (this.isDown('W')) {
        desired_vel_y = 55;
      }
      if (this.isDown('D')) {
        desired_vel_x += 3;
      }
      if (this.isDown('A')) {
        desired_vel_x -= 3;
      }
      if (this.sick === true) {
        desired_vel_y /= 1.3;
        desired_vel_x /= 1.25;
      }
      if (desired_vel_x !== 0) {
        vel_change_x = desired_vel_x - vel.x;
      }
      impulse_x = this.body.GetMass() * vel_change_x;
      impulse_y = this.body.GetMass() * desired_vel_y;
      return this.body.ApplyImpulse(new b2Vec2(impulse_x, impulse_y), this.body.GetWorldCenter());
    });
    return this;
  }
});

Grid.init(15, 40);

Crafty.init(Grid.WIDTH_IN_PIXELS, Grid.HEIGHT_IN_PIXELS).canvas.init();

Crafty.box2D.init(0, 20, 34, true);

defect = '';

random_num = Math.floor((Math.random() * 5) + 1);

switch (random_num) {
  case 1:
    defect = 'hard';
    break;
  case 2:
    defect = 'colorblind';
    break;
  case 3:
    defect = 'sick';
}

defect_size = '';

if (defect !== 'hard') {
  random_num = Math.floor((Math.random() * 5) + 1);
  switch (random_num) {
    case 1:
      defect_size = 'small';
      break;
    case 2:
      defect_size = 'flat';
      break;
    case 3:
      defect_size = 'skinny';
  }
}

if (defect === 'colorblind') {
  Crafty.sprite(32, 'images/Noeyes2.png', {
    player_sprite: [0, 0]
  });
  Crafty.sprite(32, 'images/techblocksgreen.png', {
    green_platform_sprite: [0, 0]
  });
} else if (defect === 'sick') {
  Crafty.sprite(32, 'images/Sicky4.png', {
    player_sprite: [0, 0]
  });
} else {
  Crafty.sprite(32, 'images/PersonTemplate.png', {
    player_sprite: [0, 0]
  });
}

Crafty.sprite(32, 'images/techblockblue.png', {
  default_platform_sprite: [0, 0],
  blue_platform_sprite: [0, 0]
});

if (defect !== 'colorblind') {
  Crafty.sprite(32, 'images/techblocksyellow.png', {
    yellow_platform_sprite: [0, 0]
  });
}

Crafty.background('url("images/background.png")');

floor_block = Crafty.e('2D, Canvas, Floor').attr({
  x: 0,
  y: Grid.HEIGHT_IN_PIXELS + Grid.TILE_INFO.HEIGHT
});

for (i = _i = 0, _ref = Grid.WIDTH_IN_TILES; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
  Grid.put_tile(Grid.generate_platform(), Grid.HEIGHT_IN_TILES - 1, i);
}

Grid.Generator.Frame.init();

player_w = Grid.TILE_INFO.WIDTH;

player_h = Grid.TILE_INFO.HEIGHT;

if (defect_size === 'small') {
  player_w /= 2;
  player_h /= 2;
  document.getElementById('defects').innerHTML += '<li>Stunted Growth - You are small.</li>';
} else if (defect_size === 'flat') {
  player_w *= 2;
  player_h /= 2;
  document.getElementById('defects').innerHTML += '<li>It\'s a Sack! - You got pancaked.</li>';
} else if (defect_size === 'skinny') {
  player_w /= 2;
  document.getElementById('defects').innerHTML += '<li>Picky Eater - You are skinny.</li>';
}

player = Crafty.e('2D, Canvas, Box2D, Player, PlayerControls, ViewportScroll, InfiniteGrid, player_sprite').attr({
  w: player_w * 0.88,
  h: player_h * 0.88,
  x: 0,
  y: Grid.HEIGHT_IN_PIXELS - 3 * Grid.TILE_INFO.HEIGHT
});

player.box2d({
  bodyType: 'dynamic',
  density: 1
});

player.playerControls();

player.sick = false;

player.colorblind = false;

if (defect === 'colorblind') {
  document.getElementById('defects').innerHTML += '<li>Color Blind - You can\'t see yellow blocks. (HINT: The green blocks mark where yellow blocks are.)</li>';
  player.colorblind = true;
} else if (defect === 'sick') {
  document.getElementById('defects').innerHTML += '<li>Feeble - You have a hard time moving.</li>';
  player.sick = true;
}

if (defect === 'hard') {
  document.getElementById('defects').innerHTML += '<li>Perfectionist - You take the hard way.</li>';
  player.infinite_grid_hard();
} else {
  player.infinite_grid();
}

Grid.put_tile(Grid.generate_platform(), Grid.HEIGHT_IN_TILES - 2, 10);

Grid.put_tile(Grid.generate_platform(), Grid.HEIGHT_IN_TILES - 2, 12);

player.viewport_scroll(Grid.HIGHT_IN_TILES, 20);
