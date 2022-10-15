# alex-laycalvert
# https://github.com/alex-laycalvert/slacker

CFLAGS=-std=c++20 -lncurses -lwebsockets

l1t:
	mkdir -p ./build
	$(CXX) $(CFLAGS) src/*.cpp -o ./build/slacker
dev:
	mkdir -p ./build
	$(CXX) $(CFLAGS) -Wall -Wextra src/*.cpp -o ./build/slacker.dev
