---
layout: page
title: Linear Recurrence Exercises
---

No homework this week, get ready for the Monday midterm.

## Linear recurrence exercises (not a homework)

**Problem 1.**     
Solve the linear recurrence (for *n &ge; 0*)     

        f(0) = 1,   
        f(1) = -1,   
        f(n) = f(n-2).

**WolframAlpha** is capable of solving linear recurrences, by the way, 
if you supply the recurrence equations in plain text.
\[[See the answer](http://www.wolframalpha.com/input/?i=f(0)+%3D+1,++f(1)+%3D+-1,++f(n)+%3D+f(n-2))\]

**Problem 2.**     
Solve the linear recurrence (for *n &ge; 1*)     
  
        f(1) = 10,    
        f(2) = -2,       
        f(n) = f(n-1) + 12 f(n-2).    

\[[See the answer](http://www.wolframalpha.com/input/?i=f(1)+%3D+10,++f(2)+%3D+-2,++f(n)+%3D+f(n-1)+%2B+12+f(n-2))\]

**Problem 3.**     
Solve the linear recurrence     

        f(0) = 3,
        f(1) = 1,
        f(n) = 4 f(n-1) + 21 f(n-2). 

Ask WolframAlpha yourself for the answer.

**Problem 4.**      
First, verify that &emsp; x<sup>3</sup> - 3x<sup>2</sup> + 4 = (x<sup>2</sup> - 4x + 4)(x+1).     

Then, solve the linear recurrence      

        f(0) = 0,
        f(1) = 0,    
        f(2) = 18,     
        f(n) = 3 f(n-1) - 4 f(n-3).    


## A recursive programming exercise

If you know how to program, use any programming language of your choice 
to write a **recursive function** (it should not use any loops, only recursive function calls) 
that computes the **binomial coefficients C(n,k)** using Pascal's identity. 

For example, to compute say **C(5,3)**, the function will be calling **C(4,2)** and **C(4,3)**,
and those terms will be making more function calls in their turn... So the evaluation will probably look something like this:

    C(5,3)    
        => C(4,2) + C(4,3)   
        => C(3,1) + C(3,2) + C(3,2) + C(3,3) 
        => C(2,0) + C(2,1) + C(2,1) + C(2,2) + C(2,1) + C(2,2) + 1 
        => 1 + C(1,0) + C(1,1) + C(1,0) + C(1,1) + 1 + C(1,0) + C(1,1) + 1 + 1 
        => 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 
        => 10

The trick is essentially to find what the base cases are.

**Test your function** by writing code that prints out Pascal's triangle (you can use loops here, if you want):

      1  
      1   1 
      1   2   1 
      1   3   3   1 
      1   4   6   4   1 
      1   5   10  10  5   1 
      1   6   15  20  15  6   1 
      1   7   21  35  35  21  7   1  
      1   8   28  56  70  56  28  8   1 

And, of course, it would be great if you can figure out how to line up the elements of the triangle symmetrically

                      1  
                    1   1 
                  1   2   1 
                1   3   3   1 
              1   4   6   4   1 
            1   5   10  10  5   1 
          1   6   15  20  15  6   1 
        1   7   21  35  35  21  7   1  
      1   8   28  56  70  56  28  8   1 

