using Cairo

function drawing(file, h, size)
  s = CairoPDFSurface(file, size, size)
  c = CairoContext(s)
  translate(c, size/2, size/2)
  zoom = 20
  scale(c, zoom, zoom)
  move_to(c,0,0)

  hh = h * 1.5

  function dot(xy, rgb)
    x,y = xy
    r,g,b = rgb
    set_source_rgb(c,r,g,b)
    rectangle(c, x-0.5*hh, y-0.5*hh, hh, hh)
    fill(c)
  end

  function close()
    stroke(c)
    finish(s)
  end
  
  set_source_rgb(c, 0.8, 0.8, 0.8)
  set_line_width(c, 0.0)

  return (dot, close)
end
