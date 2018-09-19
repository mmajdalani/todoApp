#include <wiringPi.h>

int main(void)
{

	wiringPiSetup();
	pinMode(7, OUTPUT);

	int currentState = digitalRead(7);
	if (currentState) {
		digitalWrite(7,0);
		delay(200);
		digitalWrite(7,1);
		delay(750);
		digitalWrite(7,0);
	}	
	else{	
		digitalWrite(7, 1);
		delay(750);
		digitalWrite(7, 0);
		
	}
	return 0;


}
