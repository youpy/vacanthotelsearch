require 'active_support/core_ext/hash'
require 'rss'
require 'digest/md5'

Dotenv.load

set :cache, Dalli::Client.new(
      ENV['MEMCACHIER_SERVERS'] || 'localhost',
      :username => ENV['MEMCACHIER_USERNAME'],
      :password => ENV['MEMCACHIER_PASSWORD'],
      :expires_in => 60.day
    )

set :public_folder, 'build/'

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/feed.xml' do
  content_type 'application/xml'

  # required parameters
  latitude = params['latitude'].to_f
  longitude = params['longitude'].to_f
  from = params['from']
  to = params['to']

  unless latitude && longitude && from && to
    content_type 'text/plain'
    halt 400, 'requred parameters are missing'
  end

  # optional parameters
  max_charge = (params['max_charge'] || 15000).to_i
  min_charge = (params['min_charge'] || 8000).to_i
  search_radius = (params['search_radius'] || 3.0).to_f

  num_days = (Date.parse(to) - Date.parse(from)).to_i
  key_prefix = '%f.%f.%s.%s' % [
    latitude,
    longitude,
    from,
    to
  ]

  endpoint = 'https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426'
  params = {
    applicationId: ENV['APPLICATION_ID'],
    affiliateId: ENV['AFFILIATE_ID'] || '1628deb0.f63eb90f.1628deb1.0add7980',
    format: 'json',
    latitude: (latitude * 3600).round(2),
    longitude: (longitude * 3600).round(2),
    checkinDate: from,
    checkoutDate: to,
    searchRadius: search_radius,
    sort: '+roomCharge',
    adultNum: 1,
    formatVersion: 2,
    searchPattern: 1,
    maxCharge: max_charge,
    minCharge: min_charge
  }

  rss = RSS::Maker.make("atom") do |maker|
    maker.channel.author = "youpy"
    maker.channel.id = "vacanthotelsearch"
    maker.channel.updated = Time.now.to_s
    maker.channel.title = "vacanthotelsearch"

    begin
      url = endpoint + '?' + params.to_query
      data = JSON.parse(HTTPClient.new.get_content(url))
      data['hotels'].each do |hotel|
        hotel_info, room_info = hotel
        maker.items.new_item do |item|
          item.link = room_info['roomInfo'][0]['roomBasicInfo']['reserveUrl']
          item.title = '%i %s / %s %s' % [
            room_info['roomInfo'][1]['dailyCharge']['total'] * num_days,
            hotel_info['hotelBasicInfo']['hotelName'],
            room_info['roomInfo'][0]['roomBasicInfo']['roomName'],
            room_info['roomInfo'][0]['roomBasicInfo']['planName']
          ]

          cache_key = Digest::MD5.hexdigest(key_prefix + item.title)
          updated = settings.cache.get(cache_key)
          unless updated
            settings.cache.set(cache_key, Time.now.to_s)
            updated = settings.cache.get(cache_key)
          end

          item.updated = updated
        end
      end
    rescue
    end
  end

  rss.to_s
end
