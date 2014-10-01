

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

