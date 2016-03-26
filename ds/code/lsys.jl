include("turtle.jl")

orange = (1.0, 0.5, 0.0)
red    = (0.9, 0.1, 0.0)
green  = (0.1, 0.7, 0.0)
blue   = (0.0, 0.4, 0.7)

function fold(f,acc,ls)
  len = length(ls)
  if len>0 
    fold(f,f(acc,ls[1]),ls[2:len])
  else
    acc
  end
end

function rewrite(rules, x)
  fold(((acc,c)->[acc,rules[c]]),[],x)
end

function run(actions, x)
  for c in x
    actions[c]()
  end
end

function draw()
  line, turn, start, done = drawing("lsys.pdf", 800)

  rules = Dict( 
    'F' => ['F','L','F','R','F','R','F','L','F'],
    'R' => ['R'] ,
    'L' => ['L'] 
  )
  
  actions(len) = Dict(
    'F' => ()-> line(len),
    'L' => ()-> turn(90),
    'R' => ()-> turn(-90)
  )

  function path(initial,rules, actions, pos, color, len, n)
    start(pos, color)
    y = initial
    for i = 1:n 
      y = rewrite(rules, y)
    end
    run(actions(len), y)
  end

  # Experiments
  x=['F']
  path(x,rules,actions, (-25,-30), orange, 1,  0)
  #path(x,rules,actions, (-25,-27), red,    1,  1)
  #path(x,rules,actions, (-25,-21), green,  1,  2)
  #path(x,rules,actions, (-25, -9),  blue,  1,  3)

  # Hilbert curve
  # rules 
  rlH = Dict( 
    'A' => ['L','B','F','R','A','F','A','R','F','B','L'],
    'B' => ['R','A','F','L','B','F','B','L','F','A','R'],
    'F' => ['F'],
    'L' => ['L'],
    'R' => ['R'] 
  )

  # actions 
  acH(len) = Dict(
    'F' => ()-> line(len),
    'L' => ()-> turn(90),
    'R' => ()-> turn(-90),
    'A' => ()-> (),
    'B' => ()-> ()
  )

  #path(['A'], rlH, acH, (-25,-25), blue, 1, 1)
  
  #path(['A'], rlH, acH, (-23,-25), blue, 1, 2)
  
  #path(['A'], rlH, acH, (-15,-25), blue, 1, 3)
  
  #path(['A'], rlH, acH, (-5,-25), blue, 1, 7)

  done()
end

function draw_alt()
  rules = Dict(
    'A' => ['B','R','A','R','B'],
    'B' => ['A','L','B','L','A'],
    'R' => ['R'] ,
    'L' => ['L'] 
  )

end
