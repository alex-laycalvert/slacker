// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#ifndef COMPONENT_HPP_
#define COMPONENT_HPP_
#include <ncurses.h>

#include <cstdlib>

class Component {
   public:
    Component(const int heightPercent, const int widthPercent,
              const bool doesAcceptInput);
    virtual void render(const bool focused, const int rows, const int cols,
                        const int rowOffset, const int colOffset) = 0;
    virtual void sendInput(const char input) = 0;
    int getWidthPercent() { return this->widthPercent; };
    void setWidthPercent(int widthPercent) {
        this->widthPercent = widthPercent;
    };
    int getHeightPercent() { return this->heightPercent; };
    void setHeightPercent(int heightPercent) {
        this->heightPercent = heightPercent;
    };
    WINDOW *getWindow() { return this->window; };
    bool acceptsInput() { return this->doesAcceptInput; };
    virtual ~Component(){};

   protected:
    WINDOW *window;
    int widthPercent;
    int heightPercent;
    bool doesAcceptInput;
};

#endif // COMPONENT_HPP_
