


# Fibonacci Numbers

function fib(n)
  if n==0 || n==1
    1
  else
    fib(n-1) + fib(n-2)
  end
end














# Improved Fibonacci with a loop

function fib_loop(n)
  if n==0 || n==1
    1
  else
    x = 1
    y = 1
    for i = 2:n
      (x, y) = (y, x+y)
    end
    y
  end
end









# Improved Recursive Fibonacci

function fib2(n)
  function next(x, y, i) 
    if i < n 
      next(y, x+y, i+1)
    else
      x+y
    end
  end

  if n==0 || n==1
    1
  else
    next(1,1,2)
  end
end




