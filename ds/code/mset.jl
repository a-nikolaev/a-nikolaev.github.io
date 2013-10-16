require("graph.jl")

function mset(z, c, num)
  if num > 0
    mset(z^2 + c, c, num-1)
  else
    z
  end
end

h = 0.004

function check(num, dot, color)
  for y = -1.2 : h : 1.2
    for x = -2.2: h : 0.6
      
      c = complex(x,y)
      z = mset(0, c, num)
      
      if abs(z) < 2 
        dot((x,y), color)
      end

    end
  end
end

function draw()
  dot, close = drawing("mset.pdf", h, 100)
  # colors (RGB)
  c1 = (0.3, 0.7, 1.0)
  c2 = (0.0, 0.5, 0.9)
  c3 = (0.0, 0.3, 0.7)
  c4 = (0.0, 0.2, 0.5)
  c5 = (0.0, 0.1, 0.3)

  #check(64, dot, c4)

  close()
end

