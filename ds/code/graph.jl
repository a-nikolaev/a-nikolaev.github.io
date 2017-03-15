using Cairo

function drawing(file, h, size)
  s = CairoPDFSurface(file, size, size)
  c = CairoContext(s)
  translate(c, size/2, size/2)
  zoom = 20
  scale(c, zoom, zoom)

  # Grid
  set_line_width(c, 0.4)
  set_source_rgb(c,0,0,0)
  move_to(c,-2.1,0);
  line_to(c,2.1,0);
  move_to(c,0,-2.1);
  line_to(c,0,2.1);
  stroke(c);
  set_line_width(c, 0.1)
  # tics
  for i = 1:2
      move_to(c,i,-2.1);
      line_to(c,i, 2.1);
      move_to(c,-i,-2.1);
      line_to(c,-i, 2.1);
      move_to(c,-2.1, i);
      line_to(c, 2.1, i);
      move_to(c,-2.1,-i);
      line_to(c, 2.1,-i);
  end
  stroke(c);

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
