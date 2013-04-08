require 'sinatra'
require 'pusher'
require 'json'

Pusher.key = '2cd60bc764bca119d7bd'
Pusher.secret = 'a3bac594f80c6dbc0076'
Pusher.app_id = '41196'

class App < Sinatra::Base
  get '/' do
    erb :index
  end

  post '/auth' do
      response = Pusher[params[:channel_name]].authenticate(params[:socket_id], {:user_id => Time.now.to_i, :user_info => {'time' => Time.now.to_i}})
      JSON.unparse(response)
  end
end