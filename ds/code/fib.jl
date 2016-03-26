

# Fibonacci Numbers

function fib(n)
  if n <= 0
    0
  elseif n == 1
    1
  else
    fib(n-1) + fib(n-2)
  end
end





# Iterative Fibonacci

function fib_array(n)
  fib = Dict{Int,Int}() # make an empty array
  fib[0] = 0            # two base cases
  fib[1] = 1            #
  
  for i = 2 : n 
    fib[i] = fib[i-1] + fib[i-2]
  end

  fib[n] # return the answer
end





# Improved iterative Fibonacci

function fib_loop(n)
  if n == 0
    0
  elseif n == 1
    1
  else

    pr = 0   # f(i-1)
    cur = 1  # f(i)
    i = 1    # i

    while (i<n) 
      pr, cur = cur, cur+pr
      i = i+1
    end

    cur

  end
end




# Improved recursive Fibonacci

function fib_loop_rec(n)
  if n == 0 
    0
  elseif n == 1
    1
  else

    function loop(i, pr, cur)
      if i < n
        loop(i+1, cur, pr+cur)
      else
        cur
      end
    end

    loop(1, 0, 1)

  end
end

