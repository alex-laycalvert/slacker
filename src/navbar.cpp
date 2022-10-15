// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#include "navbar.hpp"

#include <ncurses.h>

NavBar::NavBar(const int heightPercent, const int widthPercent,
               const vector<Channel> channels)
    : Component(heightPercent, widthPercent, false) {
    this->channels = channels;
};

void NavBar::render(const bool focused, const int rows, const int cols,
                    const int rowOffset, const int colOffset) {
    int height = rows * this->heightPercent / 100;
    int width = cols * this->widthPercent / 100;
    if (!this->window) {
        this->window = newwin(height, width, rowOffset, colOffset);
    }
    if (focused) {
        wattron(this->window, COLOR_PAIR(FOCUSED_COLOR_PAIR));
    }
    box(this->window, 0, 0);
    wattroff(this->window, COLOR_PAIR(2));

    // content
    int rowPadding = 1;
    int currentLine = 2;
    mvwprintw(this->window, currentLine, rowPadding + 1, "Channels:");
    for (int i = 0; i < (int)this->channels.size(); i++) {
        mvwprintw(this->window, ++currentLine, rowPadding + 1, "%s",
                  this->channels[i].name.c_str());
    }

    wrefresh(this->window);
}

void NavBar::sendInput(const char input) { (void)input; }
