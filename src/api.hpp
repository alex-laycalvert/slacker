// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#ifndef API_HPP_
#define API_HPP_

#define POST_ENDPOINT_URL "https://slack.com/api/apps.connections.open"
#define GET_CHANNELS_URL "https://slack.com/api/conversations.list"
#define GET_CHANNEL_HISTORY_URL "https://slack.com/api/conversations.history"

#include <curl/curl.h>

#include <string>
#include <vector>

#include "slacker.hpp"

using std::string;
using std::vector;

class SlackerAPI {
   public:
    static SlackerAPI *getSlackerAPI();
    void initialize(string apiToken, string appToken);
    vector<Channel> getChannels();
    vector<Message> getChannelMessages(string channel);
    vector<User> getUsers();

   private:
    static SlackerAPI *instance;
    string apiToken;
    string appToken;
    string endpoint;
    vector<Channel> channels;
    vector<Message> messages;
    void initializeEndpoint();
    static size_t curlEndpointHandler(void *buffer, size_t size, size_t nmemb,
                                      void *userp);
    static size_t curlChannelsHandler(void *buffer, size_t size, size_t nmemb,
                                      void *userp);
    static size_t curlChannelMessagesHandler(void *buffer, size_t size,
                                             size_t nmemb, void *userp);
    static size_t curlUsersHandler(void *buffer, size_t size, size_t nmemb,
                                   void *userp);
    SlackerAPI();
    ~SlackerAPI();
};

#endif // API_HPP_
