
function merge(a, b)
  if length(a) <= 0 
    b
  elseif length(b) <= 0
    a
  else
    if a[1] < b[1]
      [a[1], merge(a[2:length(a)],b)]
    else
      [b[1], merge(a, b[2:length(b)])]
    end
  end
end

function sort(a)
  len = length(a)
  if len > 1
    mid = int(floor(len/2))
    merge( sort(a[1:mid]), 
           sort(a[mid+1:len]) )
  else
    a
  end
end
