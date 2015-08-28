
all: generate
	
generate: generate.cpp
	g++ -o generate generate.cpp

# this rule calls the program, it generates a graph and saves it in the file output.dot,
# after that, it calls Graphviz to generate a PDF file of the generated graph
pdf: 
	./generate 100 output.dot
	dot -O -Tpdf -Kfdp output.dot

clean:
	- rm -rf generate *.o 
