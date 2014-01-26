Grid =
    TILE_INFO:
        WIDTH: 32
        HEIGHT: 32
    
    init: (tile_height, tile_width) ->
        this.HEIGHT_IN_TILES = tile_height
        this.WIDTH_IN_TILES = tile_width
        
        this.HEIGHT_IN_PIXELS = this.TILE_INFO.HEIGHT * this.HEIGHT_IN_TILES
        this.WIDTH_IN_PIXELS = this.TILE_INFO.WIDTH * this.WIDTH_IN_TILES
        
        this.tiles = new Array Grid.HEIGHT_IN_TILES
        
        for i in [0...this.tiles.length]
            this.tiles[i] = new Array Grid.LENGTH_IN_TILES
    
    generate_sprite_tile: (sprite) ->
        tile = Crafty.e('2D, Canvas, Box2D, Block, ' + sprite).attr({
            w: Grid.TILE_INFO.WIDTH
            h: Grid.TILE_INFO.HEIGHT
        })
        
        return tile
        
    generate_platform: () ->
        return this.generate_sprite_tile('default_platform_sprite')
    
    generate_yellow_platform: () ->
        return this.generate_sprite_tile('yellow_platform_sprite')
    
    generate_color_tile: (color) ->
        tile = Crafty.e('2D, Canvas, Color, Box2D, Block').color(color).attr({
            w: Grid.TILE_INFO.WIDTH
            h: Grid.TILE_INFO.HEIGHT
        })
        
        return tile
    
    put_tile: (tile, row, column) ->
        if this.tiles[row][column]
            this.tiles[row][column].destroy()
            
        this.tiles[row][column] = tile
        
        tile.attr {
            y: row * Grid.TILE_INFO.HEIGHT
            x: column * Grid.TILE_INFO.WIDTH
        }
        
        tile.box2d {
            bodyType: 'static'
        }
    
    Generator:
        big_block_square: (cubic_blocks, y_tile, x_tile) ->
            for i in [0...cubic_blocks]
                for j in [0...cubic_blocks]
                    Grid.put_tile Grid.generate_platform(), y_tile - j, x_tile + i
        
        big_block_square_yellow: (cubic_blocks, y_tile, x_tile) ->
            for i in [0...cubic_blocks]
                for j in [0...cubic_blocks]
                    Grid.put_tile Grid.generate_yellow_platform(), y_tile - j, x_tile + i
        
        big_block_rectangle: (height, length, y_tile, x_tile) ->
            for i in [0...height]
                for j in [0...length]
                    Grid.put_tile Grid.generate_platform(), y_tile - i, x_tile + j
            
        stairs: (number, y_tile, x_tile) ->
            for i in [0...number]
                for j in [0...i]
                    Grid.put_tile Grid.generate_platform(), y_tile - j, x_tile + ((i-2) * 3)
        
        cascading_stairs: (number, length, y_tile, x_tile) ->
            for i in [0...number]
                for j in [0...(length - (i * 2))]
                    Grid.put_tile Grid.generate_platform(), y_tile - i, x_tile + length - j - 3
        
        Frame:
            init: () ->
                this.current_x_tile = 1;
            
            stairs_frame: () ->
                Grid.Generator.stairs 15, Grid.HEIGHT_IN_TILES - 1, this.current_x_tile
                this.current_x_tile += 15 * 3 - 8
            
            cascading_stairs_frame: () ->
                Grid.Generator.cascading_stairs Grid.HEIGHT_IN_TILES - 5, 20, Grid.HEIGHT_IN_TILES - 1, this.current_x_tile
                this.current_x_tile += 18
                
            both_stairs_frame: () ->
                random_num = Math.floor((Math.random()*16)+1)
                
                this.cascading_stairs_frame()
                this.current_x_tile -= random_num
                
                this.cascading_stairs_frame()
                
            squares_frame: () ->
                random_num = Math.floor((Math.random()*20)+10)
                biggest_random_x = 0
                
                for i in [0...random_num]
                    random_x = Math.floor((Math.random()*20))
                    random_y = Math.floor((Math.random()*Grid.HEIGHT_IN_TILES-1))
                    
                    if random_y == Grid.HEIGHT_IN_TILES-2 or random_y == Grid.HEIGHT_IN_TILES-3
                        random_y = Grid.HEIGHT_IN_TILES-1
                    
                    if random_y > 2
                        Grid.Generator.big_block_square_yellow(2, random_y, this.current_x_tile + random_x)
                        
                        if random_x > biggest_random_x
                            biggest_random_x = random_x
                
                this.current_x_tile += biggest_random_x
            
            random_frame: () ->
                random_num = Math.floor((Math.random()*4)+1)
                
                switch random_num
                    when 1 then this.stairs_frame()
                    when 2 then this.cascading_stairs_frame()
                    when 3 then this.both_stairs_frame()
                    when 4 then this.squares_frame()
Crafty.c 'InfiniteGrid', {
    init: () ->
        return this
    
    infinite_grid_internal: () ->
        if ((Grid.Generator.Frame.current_x_tile + 5) * Grid.TILE_INFO.TILE_LENGTH > Crafty.viewport.x )
            Grid.Generator.Frame.random_frame()
        
        this.timeout(this.infinite_grid, 1750)
        
    infinite_grid: () ->
        Grid.Generator.Frame.random_frame()
        this.timeout(this.infinite_grid_internal, 2000)
}

Crafty.c 'ViewportScroll', {
    init: () ->
        return this
    
    scroll_right: () ->
        this.last_viewport_x = this.master_viewport_x
        this.master_viewport_x -= (Grid.TILE_INFO.WIDTH * 17) / 1000
        
        Crafty.viewport.scroll 'x', this.master_viewport_x 
        
        last_viewport_x_tiles = this.last_viewport_x / Grid.TILE_INFO.TILE_LENGTH
        master_viewport_x_tiles = this.master_viewport_x / Grid.TILE_INFO.TILE_LENGTH
        
        for i in [0...Grid.HEIGHT_IN_TILES]
            for j in [last_viewport_x_tiles...master_viewport_x_tiles]
                if Grid.tiles[i][j]
                    Grid.tiles[i][j].destroy()
                    Grid.tiles[i][j] = undefined
        
        this.timeout(this.scroll_right, 1)
    
    viewport_scroll: (tile_height, tile_width) ->
        Crafty.viewport.init Grid.TILE_INFO.WIDTH * tile_width, Grid.TILE_INFO.HEIGHT * tile_height
        
        this.last_viewport_x = 0
        this.master_viewport_x = Crafty.viewport.x 
        
        this.timeout(this.scroll_right, 2000)
}

Crafty.c 'PlayerControls', {
    init: () ->
        this.requires 'Keyboard'
        return this
    
    playerControls: () ->
        this.bind 'EnterFrame', () ->
            if this.disableControls
                return
            
            this.body.SetFixedRotation true
            
            vel = this.body.GetLinearVelocity()
            
            desired_vel_x = 0
            desired_vel_y = 0
            
            vel_change_x = 0
            
            if this.isDown 'W'
                desired_vel_y = 55;
                
            if this.isDown 'D'
                desired_vel_x += 3;
    
            if this.isDown 'A'
                desired_vel_x -= 3;
        
            if desired_vel_x != 0
                vel_change_x = desired_vel_x - vel.x
        
            impulse_x = this.body.GetMass() * vel_change_x
            impulse_y = this.body.GetMass() * desired_vel_y 
             
            return this.body.ApplyImpulse(new b2Vec2(impulse_x, impulse_y), this.body.GetWorldCenter());
        
        return this;
}

Grid.init(15, 40)
Crafty.init(Grid.WIDTH_IN_PIXELS, Grid.HEIGHT_IN_PIXELS).canvas.init()
Crafty.box2D.init(0, 20, 34, true)

# Init sprites
Crafty.sprite 32, 'images/PersonTemplate.png', {
    player_sprite: [0,0]
}

Crafty.sprite 32, 'images/techblockblue.png', {
    default_platform_sprite: [0,0]
    blue_platform_sprite: [0,0]
}

Crafty.sprite 32, 'images/techblocksyellow.png', {
    yellow_platform_sprite: [0,0]
}

Crafty.background 'url("images/background.png")'

floor_block = Crafty.e('2D, Canvas, Floor').attr({
        x: 0
        y: Grid.HEIGHT_IN_PIXELS + Grid.TILE_INFO.HEIGHT
    })

# Push a basic row so we don't fall through the X plane
for i in [0...Grid.WIDTH_IN_TILES]
    Grid.put_tile Grid.generate_platform(), Grid.HEIGHT_IN_TILES-1, i

Grid.Generator.Frame.init()
#Grid.Generator.Frame.cascading_stairs_frame()
#Grid.Generator.Frame.stairs_frame()
#Grid.Generator.Frame.cascading_stairs_frame()

player = Crafty.e('2D, Canvas, Box2D, Player, PlayerControls, ViewportScroll, InfiniteGrid, player_sprite').attr({
        w: Grid.TILE_INFO.WIDTH
        h: Grid.TILE_INFO.HEIGHT
        
        x: 0
        y: Grid.HEIGHT_IN_PIXELS - 3 * Grid.TILE_INFO.HEIGHT
    })

player.box2d {
        bodyType: 'dynamic'
        density: 1
}

player.playerControls()
player.infinite_grid()
player.viewport_scroll(Grid.HIGHT_IN_TILES, 20)