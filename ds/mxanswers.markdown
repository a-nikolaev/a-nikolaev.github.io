---
layout: page
title: Example Midterm - Answers 
---

##Problem 1

    p q r  p or q    not r   (p or q) -> not r
    T T T    T         F         F
    F T T    T         F         F
    T F T    T         F         F
    F F T    F         F         T
    T T F    T         T         T
    F T F    T         T         T
    T F F    T         T         T
    F F F    F         T         T

##Problem 2

    1)  p -> q                             Given
    2)  (q and s) <-> (not q or t)         Given
    3)  p and s                            Given
    
    4)  p                                  and-E, 3
    5)  s                                  and-E, 3
    6)  q                                  M.P., 1, 4
    7)  q and s                            and-I, 5, 6
    8)  ((q and s) -> (not q or t)) and    Equivalence, 2
        ((not q or t) -> (q and s))
    9)  (q and s) -> (not q or t)          and-E, 8
    10) not q or t                         M.P., 9, 7
    11) q -> t                             Equivalence, 10
    12) t                                  M.P. 11, 6

## Problem 3
Combinations with repetition.

r = 7, n = 5.   
(n+r-1 choose r) = (11 choose 7)

r = 7-4 = 3, n = 5.   
(n+r-1 choose r) = (7 choose 3)

## Problem 4
Combinations with repetition.  
(11 choose 7)


## Problem 5
First question: 4!

Second question: 4! 3! 4! 4! 5!
   
## Problem 6
Let S(n) = 1 + 2 + ... + 2^n.

*The base case:*   
S(0) = 2^0 = 1. 
We have to show that shis is equal to 2^{0+1} - 1 = 1.   
So, indeed, the base case is true.

*The inductive step:*    
Assume that S(n) = 2^{n+1} - 1, for n>=0.   
Prove that S(n+1) = 2^{n+2} - 1.  

S(n+1) = S(n) + 2^{n+1} = 2 * 2^{n+1} - 1 = 2^{n+2} - 1.

By induction, the formula is correct.

## Problem 7
f(n) = n.

