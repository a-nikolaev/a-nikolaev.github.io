# The main goal is build the executable "prog"
all: prog

# To build the program prog, two object files 
# "intset.o" and "main.o" must be built,
# then we can link them and produce the executable:
prog: intset.o main.o 
	g++ -Wall -o prog intset.o main.o

intset.o: intset.cpp intset.h
	g++ -Wall -c intset.cpp

main.o: main.cpp intset.h
	g++ -Wall -c main.cpp

# Remove the object files and the executable "prog"
clean:
	- rm -rf *.o prog
