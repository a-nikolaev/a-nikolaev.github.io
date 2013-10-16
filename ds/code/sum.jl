
# The sum of natural numbers 1+2+3+...+n 

function sum_nat(n)
  if n == 0 
    0
  else
    sum_nat(n-1) + n
  end
end

