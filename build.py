import os

print("Enter to start build loop...")
input()
while True:
	os.system('tsc --project tsconfig.json')
	print("fin\nEnter to loop...")
	input()