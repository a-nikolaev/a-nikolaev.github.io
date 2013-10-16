
# Factorial n! = 1 * 2 * ... * n 

function fact(n)
  if n == 0
    1
  else
    fact(n-1) * n
  end
end


