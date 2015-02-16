#include <iostream>
using namespace std;

/********************************************************************/
/*  GLOBAL CONSTANTS: PRODUCTS SOLD                                 */
/********************************************************************/
// The machine sells three products.
enum Product { P1 = 1, P2 = 2, P3 = 3 };
// Their prices:
const int PRICE_1 = 65;		// in cents
const int PRICE_2 = 70;		// in cents
const int PRICE_3 = 115;	// in cents


/********************************************************************/
/*  OTHER GLOBAL CONSTANTS                                          */
/********************************************************************/
const bool DEBUG = true;	// set equal to true to print debug messages


/********************************************************************/
/*  GLOBAL STATE                                                    */
/********************************************************************/
// The global state of the vending machine
// how many nickels, dimes, and quarters it has:
int nickels = 10;
int dimes = 10;
int quarters = 10;
// how many cents the customer inserted
int paid = 0;


/********************************************************************/
/*  MACHINE HARDWARE EMULATION                                      */
/********************************************************************/
void dispense_nickel () { if (nickels > 0) { nickels--; cout << "\t nickel" << endl; } }
void dispense_dime () { if (dimes > 0) { dimes--; cout << "\t dime" << endl; } }
void dispense_quarter () { if (quarters > 0) { quarters--; cout << "\t quarter" << endl; } }
void dispense_product (Product p) { cout << "\t product" << p << endl; }


/********************************************************************/
/*  VENDING MACHINE LOGIC // DECLARATIONS                           */
/********************************************************************/

/* dispense the change (the amount is given in cents) */
void dispense_change (int amount);

/* This function is executed when a customer chooses the product p.
   The machine should release the requested product if the customer paid 
   the price. After that, the machine should give back the change. */
void release (Product p);


/********************************************************************/
/*  MAIN                                                            */
/********************************************************************/
int main ()
{
	char c;
	while (cin >> c)
	{
		switch (c)
		{
			case 'n':
				nickels++;
				paid += 5;
				break;
			case 'd':
				dimes++;
				paid += 10;
				break;
			case 'q':
				quarters++;
				paid += 25;
				break;

			case '1':
				release (P1);
				break;
			case '2':
				release (P2);
				break;
			case '3':
				release (P3);
				break;
		}

		if (DEBUG)
		{
			// debug message
			cout << "\t\t["
				<< " n:" << nickels
				<< " d:" << dimes
				<< " q:" << quarters << " paid:" << paid << " ]" << endl;
		}
	}
}

/********************************************************************/
/*  VENDING MACHINE LOGIC // IMPLEMENTATION                         */
/********************************************************************/

void dispense_change (int amount)
{
	while (amount >= 5 && nickels > 0)
	{
		amount -= 5;
		dispense_nickel ();
	}
}

void release (Product p)
{
	int price = PRICE_1;
	switch (p)
	{
		case P1:
			price = PRICE_1;
			break;
		case P2:
			price = PRICE_2;
			break;
		case P3:
			price = PRICE_3;
			break;
	}

	if (paid >= price)
	{
		dispense_product (p);
		dispense_change (paid - price);	// give back the change (if have enough coins)
		paid = 0; // set paid = 0
	}
	else
	{
		// don't do anything if the customer did not pay enough
	}
}
