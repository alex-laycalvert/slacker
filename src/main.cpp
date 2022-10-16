// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#include <curl/curl.h>
#include <ncurses.h>

#include <iostream>
#include <vector>

#include "api.hpp"
#include "chat_display.hpp"
#include "chat_type.hpp"
#include "navbar.hpp"
#include "renderer.hpp"
#include "slacker.hpp"
/* #include "websocket.hpp" */

using std::vector;

void listen(char *data, int length) {
    printf("testing: %s\n", data);
    std::cout << length << "\n";
}

int main(int argc, char **argv) {
    (void)argc, (void)argv;

    /* websocket myWebSocket; */
    /* void (*listener)(char *, int) = listen; */
    /* myWebSocket.connectSocket(std::string address, int port, void
     * (*listenerCallback)(char *, int)) */

    initscr();
    keypad(stdscr, true);
    raw();
    noecho();
    curs_set(1);

    start_color();
    use_default_colors();
    init_pair(FOCUSED_COLOR_PAIR, COLOR_MAGENTA, -1);

    SlackerAPI *api = SlackerAPI::getSlackerAPI();
    api->initialize("<YOUR API TOKEN>", "<YOUR APP TOKEN>");

    vector<Channel> channels = api->getChannels();

    Renderer renderer(true);

    renderer.addComponent(new NavBar(100, 16, channels));
    renderer.addComponent(new ChatDisplay(90, 84, channels.at(0)));
    renderer.addComponent(new ChatType(12, 84));

    renderer.render();

    endwin();
    exit(0);
}
