// alex-laycalvert
// https://github.com/alex-laycalvert/slacker

#include "api.hpp"

#include <json/json.h>

#include <iostream>

SlackerAPI *SlackerAPI::instance = 0;

SlackerAPI::SlackerAPI() { endpoint = ""; }

SlackerAPI *SlackerAPI::getSlackerAPI() {
    if (!SlackerAPI::instance) {
        SlackerAPI::instance = new SlackerAPI();
    }
    return SlackerAPI::instance;
}

void SlackerAPI::initialize(string apiToken, string appToken) {
    this->apiToken = apiToken;
    this->appToken = appToken;
    this->initializeEndpoint();
}

void SlackerAPI::initializeEndpoint() {
    CURL *curlHandle = curl_easy_init();
    curl_easy_setopt(curlHandle, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curlHandle, CURLOPT_URL, POST_ENDPOINT_URL);
    curl_easy_setopt(curlHandle, CURLOPT_POSTFIELDS, "");
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(
        headers, "Content-Type: application/x-www-form-urlencoded");
    string tokenString = "Authorization: Bearer " + this->appToken;
    headers = curl_slist_append(headers, tokenString.c_str());
    curl_easy_setopt(curlHandle, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curlHandle, CURLOPT_WRITEFUNCTION, curlEndpointHandler);
    curl_easy_perform(curlHandle);
    curl_easy_cleanup(curlHandle);
}

vector<Channel> SlackerAPI::getChannels() {
    CURL *curlHandle = curl_easy_init();
    curl_easy_setopt(curlHandle, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curlHandle, CURLOPT_URL, GET_CHANNELS_URL);
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(
        headers, "Content-Type: application/x-www-form-urlencoded");
    string tokenString = "Authorization: Bearer " + this->apiToken;
    headers = curl_slist_append(headers, tokenString.c_str());
    curl_easy_setopt(curlHandle, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curlHandle, CURLOPT_WRITEFUNCTION, curlChannelsHandler);
    curl_easy_perform(curlHandle);
    curl_easy_cleanup(curlHandle);
    return this->channels;
}

vector<Message> SlackerAPI::getChannelMessages(string channel) {
    CURL *curlHandle = curl_easy_init();
    string url = GET_CHANNEL_HISTORY_URL;
    url.append("/?channel=" + channel);
    curl_easy_setopt(curlHandle, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curlHandle, CURLOPT_URL, url.c_str());
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(
        headers, "Content-Type: application/x-www-form-urlencoded");
    string tokenString = "Authorization: Bearer " + this->apiToken;
    headers = curl_slist_append(headers, tokenString.c_str());
    curl_easy_setopt(curlHandle, CURLOPT_HTTPHEADER, headers);
    string data = "channel: " + channel;
    curl_easy_setopt(curlHandle, CURLOPT_POSTFIELDS, data.c_str());
    curl_easy_setopt(curlHandle, CURLOPT_WRITEFUNCTION,
                     curlChannelMessagesHandler);
    curl_easy_perform(curlHandle);
    curl_easy_cleanup(curlHandle);
    return this->messages;
}

size_t SlackerAPI::curlEndpointHandler(void *buffer, size_t size, size_t nmemb,
                                       void *userp) {
    (void)size, (void)nmemb, (void)userp;
    char *response = (char *)buffer;
    Json::Reader reader;
    Json::Value jsonData;
    reader.parse(response, jsonData);
    bool responseOK = jsonData["ok"].asBool();
    if (!responseOK) {
        std::cerr << "Error retrieving endpoint: "
                  << jsonData["error"].asString() << "\n";
        return 0;
    }
    instance->endpoint = jsonData["url"].asString();
    return 0;
}

size_t SlackerAPI::curlChannelsHandler(void *buffer, size_t size, size_t nmemb,
                                       void *userp) {
    (void)size, (void)nmemb, (void)userp;
    char *response = (char *)buffer;
    Json::Reader reader;
    Json::Value jsonData;
    reader.parse(response, jsonData);
    bool responseOK = jsonData["ok"].asBool();
    if (!responseOK) {
        std::cerr << "Error retrieving channels: "
                  << jsonData["error"].asString() << "\n";
        return 0;
    }
    for (int i = 0; i < (int)jsonData["channels"].size(); i++) {
        Channel channel;
        channel.id = jsonData["channels"][i]["id"].asString();
        channel.name = jsonData["channels"][i]["name_normalized"].asString();
        channel.topic = jsonData["channels"][i]["topic"]["value"].asString();
        channel.purpose =
            jsonData["channels"][i]["purpose"]["value"].asString();
        instance->channels.push_back(channel);
    }
    return 0;
}

#include <ncurses.h>
size_t SlackerAPI::curlChannelMessagesHandler(void *buffer, size_t size,
                                              size_t nmemb, void *userp) {
    (void)size, (void)nmemb, (void)userp;
    char *response = (char *)buffer;
    Json::Reader reader;
    Json::Value jsonData;
    reader.parse(response, jsonData);
    bool responseOK = jsonData["ok"].asBool();
    if (!responseOK) {
        std::cerr << "Error retrieving messages: "
                  << jsonData["error"].asString() << "\n";
        return 0;
    }
    for (int i = 0; i < (int)jsonData["messages"].size(); i++) {
        Message message;
        message.userId = jsonData["messages"][i]["user"].asString();
        message.text = jsonData["messages"][i]["text"].asString();
        message.time = jsonData["messages"][i]["ts"].asString();
        instance->messages.push_back(message);
    }
    return 0;
}
