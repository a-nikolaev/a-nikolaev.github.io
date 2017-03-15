include("graph.jl")

function iterate(z, c, num)
  if num > 0
    iterate(z^2 + c, c, num-1)
  else
    z
  end
end

h = 0.004

function check(num, dot, color)
  for y = -1.2 : h : 1.2
    for x = -2.2: h : 0.6
      
      # constant c
      c = complex(x,y)
      
      # compute the recurrence formula
      z = iterate(0, c, num)
      
      if abs(z) < 2 
        dot((x,y), color)
      end

    end
  end
end

function draw()
  dot, close = drawing("mset.pdf", h, 100)
  # colors (RGB)
  c0 = (0.6, 0.9, 1.0)
  c1 = (0.3, 0.7, 1.0)
  c2 = (0.0, 0.5, 0.9)
  c3 = (0.0, 0.3, 0.7)
  c4 = (0.0, 0.2, 0.5)
  c5 = (0.0, 0.1, 0.3)


  #check(4, dot, c0)
  #check(8, dot, c1)
  #check(16, dot, c2)
  #check(32, dot, c3)
  #check(64, dot, c4)

  close()
end

