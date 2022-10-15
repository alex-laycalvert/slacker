// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#include "renderer.hpp"

#include <ncurses.h>

Renderer::Renderer(const bool focusOnFirst) {
    getmaxyx(stdscr, this->rows, this->cols);
    this->numComponents = 0;
    this->focused = -1;
    if (focusOnFirst) {
        this->focused = 0;
    }
}

void Renderer::addComponent(Component *component) {
    this->components.push_back(component);
    this->numComponents++;
}

void Renderer::render() {
    bool rendering = true;
    int c;
    while (rendering) {
        refresh();
        getmaxyx(stdscr, this->rows, this->cols);
        int currentRowOffset = 0;
        int currentColOffset = 0;
        for (int i = 0; i < this->numComponents; i++) {
            int height =
                this->rows * this->components[i]->getHeightPercent() / 100;
            int width =
                this->cols * this->components[i]->getWidthPercent() / 100;
            bool focused = i == this->focused;
            this->components[i]->render(focused, this->rows, this->cols,
                                        currentRowOffset, currentColOffset);
            if (currentColOffset + width >= this->cols - 1) {
                if (currentRowOffset + height < this->rows) {
                    currentRowOffset += height;
                }
                continue;
            }
            currentColOffset += width;
        }

        Component *focusedComponent = this->components[this->focused];
        c = wgetch(focusedComponent->getWindow());
        switch (c) {
            case 'q':
                if (focusedComponent->acceptsInput()) {
                    focusedComponent->sendInput(c);
                } else {
                    rendering = false;
                }
                break;
            case '\t':
                this->focusOnNext();
                break;
            default:
                focusedComponent->sendInput(c);
                break;
        }
    }
}

void Renderer::focusOnNext() {
    this->focused++;
    if (this->focused >= this->numComponents) {
        this->focused = 0;
    }
}

void Renderer::focusOnPrev() {
    this->focused--;
    if (this->focused > 0) {
        this->focused = this->numComponents - 1;
    }
}
