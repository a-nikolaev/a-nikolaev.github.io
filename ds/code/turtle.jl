using Cairo

function drawing(file, size)
  s = CairoPDFSurface(file, size, size)
  c = CairoContext(s)
  translate(c, size/2, size/2)
  zoom = 10
  scale(c, zoom, zoom)
  move_to(c,0,0)

  function grid(x,y)
    for i = -x:x
      move_to(c,i,-y)
      line_to(c,i, y)
    end
    for j = -y:y
      move_to(c,-x,j)
      line_to(c, x,j)
    end
  end

  function line(len)
    rel_line_to(c, len, 0)
  end

  function turn(deg)
    rotate(c, -deg*pi/180.0);
  end

  function start(xy,rgb)
    stroke(c)
    restore(c)
    save(c)
    r,g,b = rgb
    set_source_rgb(c,r,g,b)
    x, y = xy
    move_to(c,x,-y)
  end

  function close()
    stroke(c)
    finish(s)
  end
  
  set_source_rgb(c, 0.8, 0.8, 0.8)
  set_line_width(c,1.0)
  grid(size/(2*zoom), size/(2*zoom))
  stroke(c)

  set_line_width(c,4.0)
  set_source_rgb(c, 0, 0, 0)
  save(c)
  start((0,0), (0,0,0))

  return (line, turn, start, close)
end
