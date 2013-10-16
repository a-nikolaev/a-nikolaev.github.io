
# The sum of natural numbers 1+2+3+...+n 

function sum(n)
  if n == 0 
    0
  else
    sum(n-1) + n
  end
end

