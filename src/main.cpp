// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#include <ncurses.h>

#include <vector>

#include "chat_display.hpp"
#include "chat_type.hpp"
#include "navbar.hpp"
#include "renderer.hpp"
#include "slacker.hpp"

using std::vector;

int main(int argc, char **argv) {
    (void)argc, (void)argv;
    initscr();
    keypad(stdscr, true);
    raw();
    noecho();
    curs_set(1);

    start_color();
    use_default_colors();
    init_pair(FOCUSED_COLOR_PAIR, COLOR_MAGENTA, -1);

    vector<Channel> channels;

    Renderer renderer(true);

    renderer.addComponent(new NavBar(100, 16, channels));
    renderer.addComponent(new ChatDisplay(90, 84));
    renderer.addComponent(new ChatType(12, 84));

    renderer.render();

    endwin();
    exit(0);
}
