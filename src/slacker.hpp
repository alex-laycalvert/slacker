// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#ifndef SLACKER_HPP_
#define SLACKER_HPP_

#include <string>

using std::string;

typedef enum { FOCUSED_COLOR_PAIR = 100 } SlackerColorPair;

typedef struct channel_t {
    string id;
    string name;
    string topic;
    string purpose;
} Channel;

typedef struct message_t {
    string userId;
    string text;
    string time;
} Message;

typedef struct user_t {
    string id;
    string realName;
    string displayName;
} User;

#endif // SLACKER_HPP_
