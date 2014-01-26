background_track = document.getElementById('background_track')

background_track_loop = () ->
    if background_track.currentTime >= 119.5
        background_track.currentTime = 30
        
        if background_track.paused
            background_track.play()
    
    setTimeout background_track_loop, 1

setTimeout background_track_loop, 1