import wiringpi
import sys
import time


#wiringpi.wiringPiSetup();
def blink():
	wiringpi.pinMode(7,1)

	currentState = wiringpi.digitalRead(7)
	if currentState:
		wiringpi.digitalWrite(7,0)
		time.sleep(0.2)
		wiringpi.digitalWrite(7,1)
		time.sleep(1)
		wiringpi.digitalWrite(7,0)

	else:

		wiringpi.digitalWrite(7, 1)
		time.sleep(1)
		wiringpi.digitalWrite(7,0)
	

if __name__ == "__main__":
	wiringpi.wiringPiSetup()
	blink()
